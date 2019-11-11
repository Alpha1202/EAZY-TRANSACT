import express from 'express';
import userRoute from './userRoute';

const router = express.Router()

router.use('/api/user', userRoute)

export default router;
