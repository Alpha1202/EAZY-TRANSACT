import { Router } from 'express';
import transactionController from '../controller/transactionController';
import verifyToken from '../middlewares/verifyTokenMiddleware';
import validateTransactions  from '../middlewares/transactionMiddleware';


const { validateAmount } = validateTransactions;
const { 
    initiateTransfer, 
    transfer, 
    getUserTransactions, 
    getMostRecentTransaction,
    credit
 } = transactionController;

const transactionRoute = Router();

transactionRoute.post('/send',
               verifyToken, 
               validateAmount,
              initiateTransfer
);

transactionRoute.post('/transfer', verifyToken, transfer)


transactionRoute.get('/transactionlog', verifyToken, getUserTransactions)

transactionRoute.get('/recenttransaction', verifyToken, getMostRecentTransaction)

transactionRoute.post('/credit', verifyToken, validateAmount, credit)

export default transactionRoute;