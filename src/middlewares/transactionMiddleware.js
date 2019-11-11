/**
*@class validate
*/
 export default class validateTransactions {
    /**
       * validates inputs for  transactions
       * @params {object} req
       * @params {object} res
       * @returns {object} a transaction object
       */
    static validateAmount(req, res, next) {

      const { amount } = req.body;
      if (!amount || amount === 'undefined' || amount === '') {
        return res.status(400).json({ status: 400, error: 'please specify an amount' });
      }
      if (amount < 1) {
        return res.status(400).json({ status: 400, error: 'You can not transfer funds less $1' });
      }
      const numericRegExp = /^[0-9]+$/;
      if (numericRegExp.test(amount) === false) {
        return res.status(400).json({ status: 400, error: 'Please enter a valid amount' });
      }
      next();
    }
}