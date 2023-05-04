const {Schema, model} = require('mongoose')

const User = new Schema({
    email: {
        type: String, 
        unique: true,
        required: true,
    },
    username: {
        type: String, 
        unique: true,
        required: true,
    },
    password: {
        type: String, 
        required: true,
    },
    veryfication: {
        type: Boolean,
        default: false,
    },
    veryficationCode: {
        type: Number,
        requiered: true,
    }
}, {timestamps: true})

module.exports = model('User', User)