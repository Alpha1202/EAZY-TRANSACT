import models from '../db/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import config from '../db/config/config';
import { generateOTPToken } from '../helpers/helpers';
import { getOTP, validateOTP } from '../helpers/speakeasy';
import sendSms from '../helpers/sendText';

const dotenv = require('dotenv');

dotenv.config();

const { secret: jwtsecret } = config;
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

    // get authenticated user email, accountBalance and OTP secret from req object
    const { email, accountBalance, Secret, phoneNumber } = req.decodedUser;

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

    // generate random numbers
    // const random = Math.random().toString(36).slice(-10);
    
    // payload for generating OTP token
    const payload = { email, amount, transferTo }

     // Generate new OTP for each transaction
     const otptoken = generateOTPToken(payload);

    // check and replace the existing otptoken with new one
    await User.update({ otptoken }, {
        where: {
            email
          }
    })

    // generate OTP
    const OTP = getOTP(Secret);
    
    // await sendSms({
    //     from: '08139228639',
    //     to: phoneNumber,
    //     text: `Please enter this OTP ${OTP} to complete your transaction. It expires in 5minutes`
    // })

    // send user email

    const msg = {

        to: email,
        from: 'eazyTransact@eazy.com',
        subject: 'YOUR ONE-TIME-PASSWORD',
        html: `<h3>Please Use this OTP to complete your transaction, It expires in 5minutes:<h3> 
        <strong> ${OTP} </strong>`
    }

    await sgMail.send(msg);
    

    // return a notification to the user
    return res.status(200).json({
        status: 200,
        message: 'We have sent your OTP to your email and phoneNumber',
        OTP
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
       
        // get the OTP entered by the user
        const { token } = req.body;

        // get the necessary info from token
        const { email } =  req.decodedUser;
        
        // fetch the sender's data from the database
        const senderDetails = await User.findOne({ raw: true, where: { email } });
        const { secret, otptoken } = senderDetails; 

         // validate the otp using user's secret from the database
         const isValidOTP = validateOTP({
            secret,
            token
        })

        // return an error if OTP is not valid
        if(!isValidOTP) {
            return res.status(401).json({
                status: 401,
                error: 'Invalid OTp'
            })
        }

         // decode the sender details otptoken
         const compareOTPtoken = await jwt.verify(otptoken, jwtsecret);
        

         // compare the decoded OTPtoken email with the one in the database
         if(email !== compareOTPtoken.email) {
            
             return res.status(403).json({
                 status: 403,
                 error: 'Your are forbidden'
             })
         }


        // at this point, all security checks have passed successfully, now we can proceed with the actually business logic
        const { accountBalance } =  senderDetails;

        const { amount, transferTo } = compareOTPtoken;

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
