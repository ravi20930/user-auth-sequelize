const Sequelize = require('sequelize')
const sequelize = require('../util/database')
const User = require('./user')
const Address = sequelize.define('address', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
    address: Sequelize.STRING
})

User.hasMany(Address, {foreignKey: 'userId'})
Address.belongsTo(User, {foreignKey:"userId", constraints: true, onDelete: 'CASCADE'})
module.exports = Address