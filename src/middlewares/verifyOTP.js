import jwt from 'jsonwebtoken';
import config from '../db/config/config';

const { secret } = config;

/**
 * @description This function verifies OTP provided by user
 * @param {object} req the request body
 * @param {object} res the response body
 * @param {function} next passes the request to another function to be processed
 * @returns {function} next
 */
const verifyOTP = async (req, res, next) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(401).json({
      status: 401,
      message: 'OTP is not provided!',
    });
  }

  try {
    const decodedOTP = await jwt.verify(otp, secret);
    req.payload = decodedOTP.id;
    req.decodedOTP = decodedOTP;
    if (decodedOTP) return next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: 'Invalid otp provided',
    });
  }
};

export default verifyOTP;