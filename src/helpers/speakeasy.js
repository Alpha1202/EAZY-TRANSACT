import Speakeasy from 'speakeasy';

const getSecret = () => {
    const newSecret = Speakeasy.generateSecret({ length: 25});
    const secret = newSecret.base32
    return secret
}

const getOTP = (secret) => {
    
    const OTP = Speakeasy.totp({
        secret,
        encoding: "base32",
        remaining: (300 - Math.floor((new Date()).getTime() / 1000.0 % 30)),
        
    });
    return OTP;
}

const validateOTP = ( { secret, token } ) => {
    
    const validOTP = Speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token,
        window: 0
    });
    
    return validOTP;
}

module.exports = {
    getSecret,
    getOTP,
    validateOTP
}

