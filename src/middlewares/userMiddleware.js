
/**
     *@class validate
  */
 export default class validate {
    /**
       * validates inputs for creating a new user
       * @params {object} req
       * @params {object} res
       * @returns {object} a newly created user object
       */
    static validateEmail(req, res, next) {
      const { email } = req.body;
      if (!email || email === 'undefined' || email === '') {
        return res.status(400).json({ status: 400, error: 'Please enter your email' });
      }
      if (typeof email !== 'string') {
        return res.status(400).json({ status: 400, error: 'Please enter a valid email' });
      }
      const emailExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!(emailExp.test(email))) {
        return res.status(400).json({ status: 400, error: 'Invalid Email' });
      }
      next();
    }
  
    /**
       * validates inputs for creating a new user
       * @params {object} req
       * @params {object} res
       * @returns {object} a newly created user object
       */
    static validateFirstName(req, res, next) {
      const { firstName } = req.body;
      if (!firstName || firstName === 'undefined' || firstName === '') {
        return res.status(400).json({ status: 400, error: 'Please enter your First Name' });
      }
      if (typeof firstName !== 'string') {
        return res.status(400).json({ status: 400, error: 'Please enter a valid Name' });
      }
      const alphaRegExp = /^[a-zA-Z]+$/;
      if (!firstName.match(alphaRegExp)) {
        return res.status(400).json({ status: 400, error: 'Only alphabets are allowed, white spaces are not allowed' });
      }
      if (firstName.length <= 2) {
        return res.status(400).json({ status: 400, error: 'First Name should be atleast 3 letters' });
      }
      next();
    }
  
    /**
       * validates inputs for creating a new user
       * @params {object} req
       * @params {object} res
       * @returns {object} a newly created user object
       */
    static validateLastName(req, res, next) {
      const { lastName } = req.body;
      if (!lastName || lastName === 'undefined' || lastName === '') {
        return res.status(400).json({ status: 400, error: 'Please enter your Last Name' });
      }
      if (typeof lastName !== 'string') {
        return res.status(400).json({ status: 400, error: 'Please enter a valid Name' });
      }
      const alphaRegExp = /^[a-zA-Z]+$/;
      if (!lastName.match(alphaRegExp)) {
        return res.status(400).json({ status: 400, error: 'Only alphabets are allowed' });
      }
      if (lastName.length <= 2) {
        return res.status(400).json({ status: 400, error: 'Last Name should be atleast 3 letters' });
      }
      next();
    }
  
    /**
       * validates inputs for creating or logging a user
       * @params {object} req
       * @params {object} res
       * @returns {object} a user object
       */
    static validatePassword(req, res, next) {
      const { password } = req.body;
      if (!password || password === 'undefined' || password === '') {
        return res.status(400).json({ status: 400, error: 'Please enter your password' });
      }
      if (typeof password !== 'string') {
        return res.status(400).json({ status: 400, error: 'Please enter a valid Password' });
      }
      if (password.length < 6) {
        return res.status(400).json({ status: 400, error: 'Password should be atleast 6 characters' });
      }
      next();
    }
    /**
       * validates inputs for creating or logging a user
       * @params {object} req
       * @params {object} res
       * @returns {object} a user object
       */
    static validatePin(req, res, next) {
      const { pin } = req.body;
      if (!pin || pin === 'undefined' || pin === '') {
        return res.status(400).json({ status: 400, error: 'Please chose a pin' });
      }
      if (pin.length !== 4) {
        return res.status(400).json({ status: 400, error: 'Pin must be exactly four(4) digits' });
      }

      next();
      }
    /**
       * validates inputs for creating or logging a user
       * @params {object} req
       * @params {object} res
       * @returns {object} a user object
       */
    static validatePassword(req, res, next) {
      const { password } = req.body;
      if (!password || password === 'undefined' || password === '') {
        return res.status(400).json({ status: 400, error: 'Please enter your password' });
      }
      if (typeof password !== 'string') {
        return res.status(400).json({ status: 400, error: 'Please enter a valid Password' });
      }
      if (password.length < 6) {
        return res.status(400).json({ status: 400, error: 'Password should be atleast 6 characters' });
      }
      next();
    }
}