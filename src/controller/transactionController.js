import models from '../db/models';
import bcrypt from 'bcryptjs';
import { generateOTP } from '../helpers/helpers';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import config from '../db/config/config';
const dotenv = require('dotenv');

dotenv.config();

const { secret } = config;
const { User, Transaction } = models;

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


/**
 *@description Transaction Controller
 *@class TransactionController
 */
export default class TransactionController {
    /**    
* handles funds transfer logic
* @params {object} req
* @params {object} res
* @returns {object} 
*/
static async initiateTransfer(req, res) {

    // get user input
    const { amount, transferTo, pin } = req.body;

   try {

    // get authenticated user email and accountBalance from Token
    const { email, accountBalance } = req.decodedUser;

    // check for insufficient fund
    if (parseInt(accountBalance) < parseInt(amount)) {
        return res.status(400).json({
            status: 400,
            error: 'You do not have enough funds to perform this transaction'
        })
    }

    // ensure that the receivers' email is correct and exists in the database
    const receiverEmailExists = await User.findOne({raw: true, where: { email: transferTo } });
    if(!receiverEmailExists) {
        return res.status(400).json({
            status: 400,
            error: `No account is associated with the receiver email you provided`
        })
    }

    // verify senders' pin
    if(!bcrypt.compareSync(pin, req.decodedUser.pin)){
        return res.status(400).json({
            status: 400,
            error: `Incorrect Pin provided`
        })
    }

    
    // generate random numbers as payload
    const random = Math.random().toString(36).slice(-10);
    
    const payload = { email, random, amount, transferTo }

    // Generate new OTP for each transaction
    const otp = generateOTP(payload);
   

    // check and replace the existing otp with new one
    await User.update({ otp }, {
        where: {
            email
          }
    })

    // send OTP to user
    const msg = {

        to: email,
        from: 'eazyTransact@eazy.com',
        subject: 'YOUR ONE-TIME-PASSWORD',
        html: `<h3>Please Use this OTP to complete your transaction:<h3> 
        <strong> ${otp} </strong>`
    }

    await sgMail.send(msg);
    

    // return a notification to the user
    return res.status(200).json({
        status: 200,
        message: 'We have sent an OTP to your email',
        otp
      });
       
   } catch(error) {
    return res.status(500).json({
        status: 500,
        message: error.message,
      });
   }
}

static async transfer(req, res) {
    try {

        // get the necessary info from token
        const { email, random, amount, transferTo } = req.decodedOTP;


        // fetch the sender's data from the database
        const senderDetails = await User.findOne({ raw: true, where: { email } });
        const { otp } = senderDetails; 

        // decode the sender details otp
        const compareOTPRandomValue = await jwt.verify(otp, secret);
        
        // compare the decoded OTP random number with the one in the database
        if(random !== compareOTPRandomValue.random) {
            return res.status(403).json({
                status: 403,
                error: 'Your are forbidden'
            })
        }

        // at this point, all security checks have passed successfully, now we can proceed with the actually business logic
        const { accountBalance } =  senderDetails;

        // debit the sender
        const updatedBalance = parseInt(accountBalance) - parseInt(amount);

        // update sender's record
        await User.update({ accountBalance: updatedBalance}, {
            where: {
                email
            }
        })

        // send sender email notification
        const senderMsg = {

            to: email,
            from: 'eazyTransact@eazy.com',
            subject: 'DEBIT TRANSACTION ALERT',
            html: `<h3>Dear ${email}, Your have just sent $${amount} to ${transferTo},
            Your balance is $${updatedBalance}<h3>`
        }
    
        await sgMail.send(senderMsg);
        
        // fetch receiver details
        const receiverDetails = await User.findOne({ raw: true, where: { email: transferTo } });

        const newBalance = parseInt(receiverDetails.accountBalance) + parseInt(amount);
        
        // credit and update receiver's record
        await User.update({ accountBalance: newBalance }, {
            where: {
                email: transferTo
            }
        })

        // send receiver email notification
        const receiverMsg = {

            to: transferTo,
            from: 'eazyTransact@eazy.com',
            subject: 'CREDIT TRANSACTION ALERT',
            html: `<h3>Dear ${transferTo}, Your have just received $${amount} from ${email},
            Your balance is $${newBalance}<h3>`
        }
    
        await sgMail.send(receiverMsg);

         // update the transaction table
        const transactionDetails = {
            sentTo: transferTo,
            receivedFrom: email,
            amount
        }

       
        await Transaction.create(transactionDetails)

        

        return res.status(200).json({
            status: 200,
            message: `Transaction was successful, You sent ${amount} to ${transferTo}`
        })
    
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}
}
