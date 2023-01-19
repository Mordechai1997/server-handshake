const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
var randtoken = require('rand-token');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD_EMAIL
    }
});


exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email,
            }
        });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        const isPassWordMath = await bcrypt.compare(req.body.password, user.password);
        if (!isPassWordMath) {
            res.status(401).json({ message: "password is invalid" });
        }
        const userToken = jwt.sign({ userId: user.userId }, `${process.env.PASSWORD_EMAIL}`, { expiresIn: '1h' });
        await User.update({ userToken: userToken }, { where: { userId: user.userId } });
        res.cookie('token', userToken, { httpOnly: false, maxAge: 1000 * 60 * 60 });
        res.status(200).send({ message: "Log in" })

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Somthing went worng" });
    }


}
exports.signup = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email,
            }
        });
        if (user) {
            return res.status(409).json({ message: "email already exists" });
        }
        if (req.body.email && req.body.password) {
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(req.body.password, salt);
            await User.create(({
                email: req.body.email,
                username: req.body.fullName,
                password: passwordHash,
                userToken: null

            }))

            res.status(200).json({ message: "user created" });
        } else if (!req.body.password) {
            return res.status(400).json({ message: "password not provided" });
        } else if (!req.body.email) {
            return res.status(400).json({ message: "email not provided" });
        };
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Something went worng" })
    }
}
exports.resetPasswordEmail = (req, res, next) => {
    User.findOne({
        where: {
            email: req.query.email,
        }
    }).then(dbUser => {
        if (!dbUser) {
            return res.status(404).json({ message: "The Email is not registered with us" });
        } else {
            const token = randtoken.generate(20);
            var mailOptions = {
                from: process.env.USER_EMAIL,
                to: dbUser.dataValues.email,
                subject: 'Reset Password Link',
                html: '<p>You requested for reset password, kindly use this <a href="http://localhost:3000/reset-password?token=' + token + '">link</a> to reset your password</p>'

            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error + '\n');
                    return res.status(500).json({
                        message: "Something goes to wrong. Please try again"
                    })
                } else {
                    console.log('Email sent: ' + info.response);
                    console.log(dbUser)
                    dbUser.update({ userToken: token })
                        .then(() => {
                            return res.status(200).json({
                                message: 'The reset password link has been sent to your email address'
                            })
                        })
                        .catch((e) => {
                            console.log(e)
                            return res.status(500).json({
                                message: "Something goes to wrong. Please try again"
                            })
                        })
                }
            });
        }
    })
}
exports.updatePassword = (req, res, next) => {
    var { token, password } = req.body;

    User.findOne({
        where: {
            userToken: token
        }
    }).then((dbUser) => {
        if (!dbUser) {
            return res.status(404).json({
                message: 'The link has expired'
            })
        }
        bcrypt.hash(req.body.password, 8, (err, passwordHash) => {
            if (err) {
                return res.status(500).json({ message: "couldnt hash the password" });
            } else if (passwordHash) {
                dbUser.update({ password: passwordHash })
                    .then(() => {
                        return res.status(200).json({
                            message: 'Your password has been updated successfully'
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(502).json({ message: "error while update password" });
                    });
            };
        })

    }).catch((e) => {
        return res.status(500).json({
            message: 'Invalid link please try again'
        })
    })
}
exports.isAuth = async (req, res, next) => {
    try {
        const cookie = req.cookies.token;
        if (!cookie) {
            res.status(403).send({ message: 'auth faild' })
        }
        else {
            const isVarify = jwt.verify(cookie, process.env.PASSWORD_EMAIL);
            if (isVarify.userId) {
                res.status(200).send({
                    message: 'access exist', userInfo: await User.findOne({
                        where: {
                            userId: isVarify.userId,
                        }
                    })
                });
            }
        }
    }
    catch (err) {
        res.status(405).send(err)
    }

};
exports.isAuthControllers = (req, res, next) => {
    try {
        const cookie = req.cookies.token;
        if (!cookie) {
            res.status(401).send({ message: "not auth" });
        }
        else {
            const isVarify = jwt.verify(cookie, process.env.PASSWORD_EMAIL);
            if (isVarify.userId) {
                next();
            }
        }
    } catch (err) {
        res.status(500).send({ message: "Somthing went worng in isAuth" });

    }


}
exports.getEmailUserByMemberId =async (req, res, next) => {
    try {
        var { id, password } = req.query;

        const user =await User.findOne({
            where: {
                userId: id
            }
        });

       return res.status(200).json({email: user.email, name: user.username});
    } catch (err) {
       return res.status(500).send({ message: "Somthing went worng in isAuth" });

    }

}
