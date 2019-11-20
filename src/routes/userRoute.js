import { Router } from 'express';
import userController from '../controller/userController';
import verifyToken from '../middlewares/verifyTokenMiddleware';
import validate from '../middlewares/userMiddleware';

const { 
    validateEmail,
    validateFirstName,
    validateLastName,
    validatePin,
    validatePassword
} = validate
const { createAccount, login, getUserProfile } = userController;

const userRoute = Router();

userRoute.post('/signup',
    validateEmail,
    validateFirstName,
    validateLastName,
    validatePin,
    validatePassword,
    
    createAccount);

userRoute.post('/signin',

    validateEmail,
    validatePassword, 
    
    login
)

userRoute.get('/getuser', verifyToken, getUserProfile)

export default userRoute;

