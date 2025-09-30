
const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Address = sequelize.define('Address', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  street: { type: DataTypes.STRING(200), allowNull: false },
  number: { type: DataTypes.STRING(20), allowNull: true },
  city: { type: DataTypes.STRING(100), allowNull: false }
}, {
  tableName: 'addresses'
});

module.exports = Address;
