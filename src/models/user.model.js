const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "owner", "deliverBoy"],
        required: true
    }

}, { timestamps: true })



const User = mongoose.model('users', userSchema)

module.exports = User