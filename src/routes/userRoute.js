import { Router } from 'express';
import userController from '../controller/userController';
import validate from '../middlewares/userMiddleware';

const { 
    validateEmail,
    validateFirstName,
    validateLastName,
    validatePin,
    validatePassword
} = validate
const { createAccount } = userController;

const userRoute = Router();

userRoute.post('/signup',
    validateEmail,
    validateFirstName,
    validateLastName,
    validatePin,
    validatePassword,
    
    createAccount);

export default userRoute;

