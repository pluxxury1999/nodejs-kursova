const Router = require('express')
const path = require('path')
const router = new Router()
const controller = require('./authController')
const authMiddleware = require('./middleware/authMiddleware')
const {check} = require('express-validator')

const createPath = (page) => path.resolve(__dirname, 'pages', `${page}.html`)

router.post('/registration', [
    check('email', 'email wrong').notEmpty().isEmail(),
    check('username', 'username wrong').notEmpty(),
    check('password', 'password to short').isLength({min: 4})
], controller.register)

router.post('/main', controller.settings)

router.post('/login', controller.login)

router.post('/confirmation',[
    check('code', 'Empty code').notEmpty(),
], controller.confirmation)

router.get('/main', authMiddleware, controller.main)

router.get('/login', (req, res) => {
    res.sendFile(createPath('login'))
})

router.get(['/registration', '/'], (req, res) => {
    res.sendFile(createPath('registration'))
})

router.get('/confirmation', (req, res) => {
    res.sendFile(createPath('confirmation'))
})

module.exports = router