import { hashPassword, authToken } from '../helpers/helpers';
import models from '../db/models';

const { User } = models;


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

        //  create new user if the email does not exist
        const userData = { firstName, lastName, email, phoneNumber, password: encryptedPassword, pin: encryptedpin, accountBalance }
        const newUserAccount = await User.create(userData);

        // remove user password and pin
        delete newUserAccount.dataValues.password;
        delete newUserAccount.dataValues.pin;

        // generate authentication token with user details
        const token = authToken(newUserAccount.dataValues)

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
}