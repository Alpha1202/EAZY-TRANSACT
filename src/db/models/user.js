module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
      },
      accountBalance: {
        type: DataTypes.STRING,
      },
      pin: {
        type: DataTypes.STRING
      },
      otptoken: {
        type: DataTypes.TEXT
      },
      secret: {
        type: DataTypes.STRING
      }
    },
  );
  User.associate = models => {
    User.hasMany(models.Transaction, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
  return User;
};