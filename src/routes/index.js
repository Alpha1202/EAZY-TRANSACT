import express from 'express';
import userRoute from './userRoute';
import transactionRoute from './transactionRoutes';

const router = express.Router()

router.use('/api/user', userRoute)
router.use('/api/transaction', transactionRoute)

export default router;
