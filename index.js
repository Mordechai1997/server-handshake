require('dotenv').config();
const express = require('express')
const cors = require('cors');
const sequelize = require('./db');
const loginRoute = require('./routers/login.js');

const app = express()

app.use(express.json());
app.use(cors({ origin: true, credentials: true }))
app.use(loginRoute);
app.listen(process.env.PORT, function () {
    sequelize.sync();
    console.log(`\n server listening on port ${process.env.PORT} \n`)
})
