import { Router } from 'express';
import transactionController from '../controller/transactionController';
import verifyToken from '../middlewares/verifyTokenMiddleware';
import validateTransactions  from '../middlewares/transactionMiddleware';


const { validateAmount } = validateTransactions;
const { initiateTransfer, transfer } = transactionController;

const transactionRoute = Router();

transactionRoute.post('/send',
               verifyToken, 
               validateAmount,
              initiateTransfer
);

transactionRoute.post('/transfer', verifyToken, transfer)

export default transactionRoute;