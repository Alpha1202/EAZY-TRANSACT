import { hashPassword, authToken } from '../helpers/helpers';
import models from '../db/models';
import bcrypt from 'bcryptjs';
import sgMail from '@sendgrid/mail';
import { getSecret } from '../helpers/speakeasy';
const dotenv = require('dotenv');

dotenv.config();

const { User } = models;

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

/**
 *@description User Controller
 *@class userController
 */
export default class UserController {
/**    
* Create a new user
* @params {object} req
* @params {object} res
* @returns {object} a newly created user object
*/
static async createAccount (req, res) {
    try {
        // get user input
        const { firstName, lastName, email, phoneNumber, password, pin } = req.body;

        // encrypt user password and pin
        const encryptedPassword = hashPassword(password);
        const encryptedpin = hashPassword(pin);

        // default account balance for development purposes
        const accountBalance = 1000

        // checks if user's email is already in use
        const userExists = await User.findOne({ raw: true, where: { email } });
        if(userExists) {
            return res.status(409).json({ message: `This email ${email} is already signed up` }); 
         }

        //  get new secret for user
         const secret = getSecret();

        //  create new user if the email does not exist
        const userData = { firstName, lastName, email, phoneNumber, password: encryptedPassword, pin: encryptedpin, accountBalance, secret }
        const newUserAccount = await User.create(userData);

        // get secret from user object
        const { secret: Secret } = newUserAccount.dataValues

        // remove user password, secret and otp from the returned user object
        delete newUserAccount.dataValues.password;
        delete newUserAccount.dataValues.secret;
        delete newUserAccount.dataValues.otp;
    

        // generate authentication token with user details
        const token = authToken({...newUserAccount.dataValues, Secret})

        // send email to user upon successful signup
        const msg = {

            to: email,
            from: 'eazyTransact@eazy.com',
            subject: 'Account Created successfully',
            html: `<h3>Welcome ${firstName} ${lastName}, Your Pin Is<h3> 
            <strong> ${pin} </strong>`
        }
    
        await sgMail.send(msg);

        // return a response to the user
        return res.status(201).json({ 
            message: `Account created successfully, Your pin is ${pin}`,
            details: newUserAccount,
            token
         });
    }
    // catch any error
    catch(error) {
        return res.status(500).json({ message: error.message });
    }
}
/**
 * @description Login a user
 * @param {object} req
 * @param {object} res
 * @return {json} user logged in
 * @memberof UserController
 */
static async login(req, res) {
    try {
    // accept user input
    const { email, password } = req.body;

   
    // fetch user from the database
    const user = await User.findOne({ where: { email } });


    // check if the user exists
    if (user) {

        // get email from user object
        const { email } = user.dataValues;
    
        // check if password matches
        if (bcrypt.compareSync(password, user.password)) {
 
        // if password matches, create new secret that will be used to replace the existing one
        const secret = getSecret();
        
        // update the user secret 
        await User.update({ secret }, {
        where: {
            email
            }
        })

        // return the logged in user
        const loggedInUser = await User.findOne({ where: { email } });

        // get secret from user object
        const { secret: Secret } = loggedInUser.dataValues

        // remove loggedInUser password, secret and from the user object
        delete loggedInUser.dataValues.password;
        delete loggedInUser.dataValues.secret;
        delete loggedInUser.dataValues.otp;

        // generate authentication token with user details
        const token = authToken({...loggedInUser.dataValues, Secret});

    // return a response to the user
    return res.status(200).json({ 
        message: `Login Successful`,
        details: loggedInUser,
        token
     });
}
    return res.status(401).json({
    status: 401,
    message: 'Invalid email or password'
});
}
    return res.status(401).json({
    status: 401,
    message: 'Invalid email or password'
  });
} catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message
    });
  }
}


}
