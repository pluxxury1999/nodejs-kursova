const User = require('./models/User')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const {validationResult} = require('express-validator')
const { type } = require('os')
require('dotenv').config()
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const mailer = require('./nodemailer')

const createPath = (page) => path.resolve(__dirname, 'pages', `${page}.html`)

function generateRandomNumber() {
    return Math.floor(Math.random() * 9000) + 1000
}

const generateJWT = (id, username) => {
    const payload = {
        id,
        username
    }
    return jwt.sign(payload, process.env.JWT_CONFIG, {expiresIn: '5m'})
}

class authController {
    async register(req, res) {
        try {
            const validationErrors = validationResult(req)
            if (!validationErrors.isEmpty()) {
                return res.status(400).json({ massage: 'registration error' })
            }
            const {email, username, password} = req.body
            const candidateEmail = await User.findOne({ email })
            if (candidateEmail) {
                return res.status(400).json({ massage: 'email  is busy' })
            }
            const candidateUsername = await User.findOne({ username })
            if (candidateUsername) {
                return res.status(400).json({ massage: 'username is busy' })
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const verifycationCode = generateRandomNumber()
            const user = new User({ email, username, password: hashPassword, veryficationCode: verifycationCode })
            await user.save()
            localStorage.setItem('username', username);

            const massage = {
                to: email,
                subject: `Hi ${username}, verify your account` ,
                text: `Verifycation code is ${verifycationCode}`,
            }
            mailer(massage)
            return res.status(200).json({
                massage: 'registration success',
                username: username,
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({ massage: 'register error' })
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({ username })
            if (user.veryfication === false) { 
                return res.status(403).json({ massage: `verify your email` })
            }
            if (!username) { 
                return res.status(400).json({ massage: `${username} not found` })
            }

            const isValidPassword = bcrypt.compareSync(password, user.password)
            if (!isValidPassword) { 
                return res.status(400).json({ massage: 'wrong password' })
            }

            const token = generateJWT(user._id, user.username)
            // res.cookie('Authorization',`Bearer ${token}`, {maxAge: 60 * 60 * 1000, httpOnly: true})
            // res.setHeader('Authorization', 'Bearer ' + token);
            // res.send('headears sended')
            // res.setHeader('Authorization', `Bearer ${token}`)
            // res.json({token: token})
            localStorage.setItem('Authorization', `Bearer ${token}`)
            localStorage.setItem('username', username);
            return res.status(200).json({token: `Bearer ${token}`})
            // return res.redirect('/test')
        } catch (error) {
            console.log(error)
            return res.status(400).json({ massage: 'login error' })
        }
    }

    async confirmation(req, res) {
        try {
            const {username, code} = req.body
            const user = await User.findOne({ username })
            if (!username) { 
                return res.status(400).json({ massage: `${username} not found` })
            }
            const isValidCode = (code === user.veryficationCode.toString())
            if (!isValidCode) { 
                return res.status(400).json({ massage: 'wrong code' })
            } else {
                await User.updateOne(
                    { _id: user._id },
                    { $set: { veryfication: true } }
                )
            }
            const token = generateJWT(user._id, user.username)
            localStorage.setItem('Authorization', `Bearer ${token}`);
            return res.status(200).json({token: `Bearer ${token}`})
        } catch (error) {
            console.log(error)
            return res.status(400).json({ massage: 'login error' })
        }
    }

    async settings(req, res) {
        try {
            const { username, oldPassword, newPassword } = req.body
            const user = await User.findOne({ username })
            if (!username) { 
                return res.status(400).json({ massage: `${username} not found` })
            }
            const isValidPassword = bcrypt.compareSync(oldPassword, user.password)
            if (!isValidPassword) { 
                return res.status(400).json({ massage: 'wrong password' })
            }
            const hashPassword = bcrypt.hashSync(newPassword, 7)
            await User.updateOne(
                { _id: user._id },
                { $set: { password: hashPassword } }
            )
            return res.status(200).json({ massage: 'successfuly changed' })
        } catch (error) {
            return res.status(400).json({ massage: 'password changing error' })
        }
    }

    async main(req, res) {
        try {
            return res.sendFile(createPath('main'))
            // return res.json({ massage: 'hi from test' })
        } catch (error) {
            console.log(error)
            return res.status(400).json({ massage: 'main error' })
        }
    }
}

module.exports = new authController()