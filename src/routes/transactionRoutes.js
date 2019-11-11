import { Router } from 'express';
import transactionController from '../controller/transactionController';
import verifyToken from '../middlewares/verifyTokenMiddleware';
import verifyOTP from '../middlewares/verifyOTP';

const { initiateTransfer, transfer } = transactionController;

const transactionRoute = Router();

transactionRoute.post('/send', verifyToken, initiateTransfer);

transactionRoute.post('/transfer', verifyToken, verifyOTP, transfer)

export default transactionRoute;