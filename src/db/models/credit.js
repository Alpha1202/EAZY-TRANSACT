module.exports = (sequelize, DataTypes) => {
  const Credit = sequelize.define(
    'Credit',
  {
    senderEmail: {
      type: DataTypes.STRING,
    },
    receiverEmail: {
      type: DataTypes.STRING,
    },
    transactionType: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.STRING,
    }
  }, {});
  Credit.associate = function(models) {
    // associations can be defined here
  };
  return Credit;
};