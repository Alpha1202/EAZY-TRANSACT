'use strict';
module.exports = (sequelize, DataTypes) => {
  const Debit = sequelize.define('Debit', {
    title: DataTypes.STRING
  }, {});
  Debit.associate = function(models) {
    // associations can be defined here
  };
  return Debit;
};