const { Sequelize } = require('sequelize');

const sequelize = new Sequelize( process.env.DB_NAME,  process.env.USER_NAME, process.env.PASSWORD, {
    host: 'localhost',
    port: process.env.PORT_DB,
    dialect: 'mysql'
});

module.exports = sequelize;