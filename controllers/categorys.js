const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
var randtoken = require('rand-token');
const jwt = require('jsonwebtoken');
const Categorys = require('../models/Categorys');
const Product = require('../models/product');
const sequelize = require('../db');


exports.uploadImage = (req, res) => {
    res.status(200);
}
exports.addproduct = async (req, res) => {
    try {
        await Product.create(({
            user_id: req.body.userId,
            title: req.body.title,
            category_type: req.body.categoryType,
            image_name: req.body.fileName,
            city: req.body.city,
            street: req.body.street,
            numberAtHome: req.body.numberAtHome,
            phone_number: req.body.phone,
            delivery_or_loen: req.body.deliveryOrLoen,
            description: req.body.description
        })).then(() => {
            return res.status(200).json({
                message: 'The post was successfully published!'
            })
        })

    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Somthing went worng" });
    }
}
exports.getAllCategorys = async (req, res) => {
    try {
        const allCategorys = await Categorys.findAll({});
        res.status(200).send(allCategorys)
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Somthing went worng" });
    }

}
exports.getAllProducts = async (req, res) => {
    try {
        const query = "SELECT * FROM products AS p JOIN categorys AS c ON p.category_type=c.CategoryId";
        const [results, metadata] = await sequelize.query(query);
        res.status(200).send(results)

    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Somthing went worng" });
    }

}
exports.getProductsByRange = async (req, res) => {
    try {
        const limit = req.query.limit;
        const query = `SELECT * FROM products AS p JOIN categorys AS c ON p.category_type=c.CategoryId ORDER BY 1 DESC LIMIT ${limit * 9}`;
        const [results, metadata] = await sequelize.query(query);
        res.status(200).send(results)

    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Somthing went worng" });
    }

}
exports.getCountProducts = async (req, res) => {
    try {
        const count = await Product.count({});
        res.status(200).send({ count })

    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Somthing went worng" });
    }

}
exports.ProductsBySearch = async (req, res) => {
    try {
        const { text, cnt } = req.body;
        const queryList = `SELECT  * FROM products AS p JOIN categorys AS c ON p.category_type=c.CategoryId WHERE title LIKE '%${text}%' OR categoryName LIKE '%${text}%' OR  description LIKE '%${text}%' ORDER BY 1 DESC LIMIT ${cnt * 9}`;
        const queryCnt = `SELECT  COUNT(*) as cnt FROM products AS p JOIN categorys AS c ON p.category_type=c.CategoryId WHERE title LIKE '%${text}%' OR categoryName LIKE '%${text}%' OR  description LIKE '%${text}%' `;

        const [resultsList, metadataList] = await sequelize.query(queryList);
        const [resultsCnt, metadataCnt] = await sequelize.query(queryCnt);

        list = resultsList.slice(cnt * 9 - 9, cnt * 9);
        count = resultsCnt[0].cnt ;

        res.status(200).send({ list, count })

    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Somthing went worng" });
    }
}

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.query;
        const query = `SELECT  * FROM products AS p JOIN categorys AS c ON p.category_type=c.CategoryId 
        WHERE product_id=${id} LIMIT 1`;

        const [result, metadata] = await sequelize.query(query);
        res.status(200).send(result[0])

    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Somthing went worng" });
    }
}

