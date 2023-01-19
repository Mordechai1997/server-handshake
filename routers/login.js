const express = require('express');
const router = express.Router();
const controllerSignin = require('../controllers/login')


router.post('/login', controllerSignin.signin)
router.post('/signup', controllerSignin.signup)
router.get('/reset-password-email', controllerSignin.resetPasswordEmail)
router.post('/update-password', controllerSignin.updatePassword)
router.get('/getEmailUserByMemberId', controllerSignin.getEmailUserByMemberId)
router.get('/auth', controllerSignin.isAuth)





module.exports = router;