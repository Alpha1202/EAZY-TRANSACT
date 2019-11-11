import jwt from 'jsonwebtoken';;
import bcrypt from 'bcryptjs';

export const hashPassword = password => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  };

export const authToken = userData => {
    return jwt.sign(userData, process.env.SECRET_KEY, { expiresIn: '24h' });
}

export const generateOTP = payload => {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
}




