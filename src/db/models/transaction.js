module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    'Transaction',
    {
      userId: {
        type: DataTypes.INTEGER,
      },
      sentTo: {
        type: DataTypes.STRING,
      },
      receivedFrom: {
        type: DataTypes.STRING,
      },
      transactionType: {
        type: DataTypes.ENUM('CREDIT', 'DEBIT'),
      },
      amount: {
        type: DataTypes.STRING,
      }
    },
  );
  Transaction.associate = models => {
    Transaction.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
  return Transaction;
};