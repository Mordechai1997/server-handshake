const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require("bcrypt-nodejs");

const User = sequelize.define('users', {
    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false

    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userToken: {
        type: DataTypes.STRING,
        allowNull: true
    }


})


// User.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.local.password);
// };

module.exports = User;