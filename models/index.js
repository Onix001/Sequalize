
const sequelize = require('../db/conn');
const User = require('./User');
const Address = require('./Address');

// Associations
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses', onDelete: 'CASCADE' });
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { sequelize, User, Address };
