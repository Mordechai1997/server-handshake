const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require("bcrypt-nodejs");

const Product = sequelize.define('product', {
    product_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category_type: {
        type: DataTypes.INTEGER,
        allowNull: false

    },
    image_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    street: {
        type: DataTypes.STRING,
        allowNull: true
    },
    numberAtHome: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    delivery_or_loen: {
        type: DataTypes.INTEGER,
        allowNull: false
    }


})


// User.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.local.password);
// };

module.exports = Product;