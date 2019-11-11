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
        type: DataTypes.FLOAT,
      },
      pin: {
        type: DataTypes.INTEGER
      }
    },
  );
  return User;
};