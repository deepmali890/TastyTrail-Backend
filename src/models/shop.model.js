const mongoose = require('mongoose')


const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    shopImage: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    phone: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    shopType: {
        type: String,
        enum: ["Restaurant", "Cafe", "Bakery", "Food Truck", "Others"],
        default: "Restaurant",
    },
    isOpen: {
        type: Boolean,
        default: true,
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    }]
}, { timestamps: true })

const Shop = mongoose.model('shop', shopSchema)

module.exports = Shop
