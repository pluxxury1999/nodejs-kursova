const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const path = require('path');
const authRouter = require('./authRouter')
require('dotenv').config()
const PORT = process.env.PORT || 3000
const app = express()

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use('/', authRouter)


const start = async() => {
    try {
        await mongoose.connect(process.env.DB_CONNECT)
        app.listen(PORT, () => {
            console.log(`i\'m here http://localhost:${PORT}/registration`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()