module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    'Transaction',
    {
      sentTo: {
        type: DataTypes.STRING,
      },
      receivedFrom: {
        type: DataTypes.STRING,
      },
      amount: {
        type: DataTypes.STRING,
      }
    },
  );
  Transaction.associate = models => {
    Transaction.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  }
  return Transaction;
};