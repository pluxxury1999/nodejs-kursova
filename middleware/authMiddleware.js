const jwt = require('jsonwebtoken')
require('dotenv').config()
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

const createPath = (page) => path.resolve(__dirname, 'pages', `${page}.html`)

module.exports = function(req, res, next) {
    try {
        const token = localStorage.getItem('Authorization').split(' ')[1]
        if (!token) {
            return res.status(403).json({ massage: 'not authorized'})
        }
        const decoded = jwt.verify(token, process.env.JWT_CONFIG)
        req.user = decoded
        next()
    } catch (error) {
        console.log(error)
        return res.status(403).json({ massage: 'not authorized'})
    }
}