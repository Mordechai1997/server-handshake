require('dotenv').config();
const express = require('express')
const cors = require('cors');
const sequelize = require('./db');
const loginRoute = require('./routers/login.js');
const categorysRoute = require('./routers/categorys.js');
const cookies = require("cookie-parser");
const bodyParser = require('body-parser');
const path = require('path');
const app = express()

app.use(cookies());
app.use(express.json());
app.use(cors({ origin: true, credentials: true }))
app.use('/products',categorysRoute);
app.use(loginRoute);
app.use(bodyParser.json({limit: '1000mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '1000mb', extended: true}))
app.use(express.urlencoded({ extended: true }));

var dir = path.join(__dirname, 'images');
app.use(express.static(dir));

app.listen(process.env.PORT, function () {
    sequelize.sync();
    console.log(`\n server listening on port ${process.env.PORT} \n`)
})
