const express = require('express');
const connection = require('../db/connection');
const router = express.Router();

const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer')
require("dotenv").config();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');


router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email,password,role,status from users where email=?"
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into users(name,contact,email,password,status,role) values(?,?,?,?,'false','user')"
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200)
                            .json({ message: "Signup Successful" })
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                console.log(user.email)
                return res.status(400).json({ message: "Email Already Exist." });
            }
        }
        else {
            return res.status(500)
                .json(err);
        }
    })

})


router.post('/login', (req, res) => {
    const user = req.body;
    query = "select email,password,role,status from users where email =?"
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({
                    message: "Incorrect Username and password"
                });
            }
            else if (results[0].status === 'false') {
                return res.status(401).json({
                    message: "Wait for Admin Approval"
                });
            }
            else if (results[0].password == user.password) {
                const response = { email: results[0].email, role: results[0].role }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '10m' })
                res.status(200).json({
                    token: accessToken
                });
            }
            else {
                return res.status(400).json({
                    message: "Something went wrong, please try again later"
                })
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})


//ROUTE TO PROVIDE THE FORGOT PASSWORD SERVICE
router.post('/forgotpassword', (req, res) => {
    const user = req.body;
    query = "select email,password from users where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({
                    message: "Password sent successfully to your email"
                })
            }
            else {
                var mail = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Password by Cafe Management System',
                    html: '<p><b>Your Login detail for Cafe Management System </b><br><b>Email:</b>'
                        + results[0].email + '<br><b>Password: </b>'
                        + results[0].password + '<br><a href="http://localhost:4200/">Click here to login"></a></p>'
                };
                transporter.sendMail(mail, function (err, info) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('Email Sent: ' + info.response);
                    }
                });
                return res.status(200).json({
                    message: "Password sent successfully to your email"
                });
            }
        }
        else {
            return res.status(500).json(err)
        }
    })
})


router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    var query = "select id,name,email,contact,status from users where role='user'";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})


router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    var query = "update users set status=? where id =?";
    connection.query(query, [user.status, user.id], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(404).json({
                    message: "User id doest not exist"
                })
            }
            return res.status(200).json({ message: "User Updated Successfully" })
        }
        else {
            return res.status(500).json(err);
        }
    })
})


router.get('/checkToken', auth.authenticateToken, (req, res) => {
    return res.status(200).json({ message: "true" });
})


router.post('/changePassword', auth.authenticateToken, (req, res) => {
    let user = req.body;
    const email = res.locals.email;
    var query = "select * from users where email =? and password=?";
    connection.query(query, [email, user.oldPassword], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(400).json({ message: "Incorrect Old Password" })
            }
            else if (results[0].password == user.oldPassword) {
                query = "update users set password=? where email = ?";
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Password Changed Successfully" })
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "Soomething Went Wrong, Please try again Later" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;