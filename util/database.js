const Sequelize = require('sequelize');

const sequelize = new Sequelize('userdb', 'root', 'password', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
