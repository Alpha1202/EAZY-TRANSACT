import Speakeasy from 'speakeasy';

const getSecret = () => {
    const newSecret = Speakeasy.generateSecret({ length: 25});
    const secret = newSecret.base32
    return secret
}

const getOTP = (secret) => {
    
    const OTP = Speakeasy.totp({
        secret: secret.base32,
        encoding: "base32",
        remaining: (300 - Math.floor((new Date()).getTime() / 1000.0 % 30)),
        
    });
    return OTP;
}

const validateOTP = async ( { secret, token } ) => {
    
   return Speakeasy.totp.verify({
        secret: secret.base32,
        encoding: "base32",
        token
    });
    
}

module.exports = {
    getSecret,
    getOTP,
    validateOTP
}

