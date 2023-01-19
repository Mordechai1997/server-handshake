const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require("bcrypt-nodejs");

const Categorys = sequelize.define('Categorys', {
    CategoryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    CategoryName: {
        type: DataTypes.STRING,
        allowNull: false
    }
})
// Categorys.sync().then(() => {
//     Categorys.create({
//         CategoryName: 'Housewares'
//     });
//     Categorys.create({
//         CategoryName: 'vehicle'
//     });
//     Categorys.create({
//         CategoryName: 'Building'
//     });
//     Categorys.create({
//         CategoryName: 'electronics'
//     });
//   });

// User.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.local.password);
// };

module.exports = Categorys;