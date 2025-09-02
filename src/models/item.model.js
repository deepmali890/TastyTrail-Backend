const mongoose = require('mongoose')


const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Item name is required"],
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    price: {
        type: Number,
        min: [0, "Price must be positive"],
        required: true
    },
    available: {
        type: Boolean,
        default: true,
    },
    spiceLevel: {
        type: String,
        enum: ["Mild", "Medium", "Hot"],
        default: "Medium",
    },
    image: {
        type: String,
        required: true
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shop",
        required: true
    },
    category: {
        type: String,
        enum: [
            "Snacks", "Main Course", "Desserts", "Pizza", "Burgers", "Sandwiches", "South Indian", "North Indian", "Chinese", "Fast Food", "Others"
        ],
        required: true
    },
    foodType: {
        type: String,
        enum: ["Veg", "Non-Veg"],
        required: true
    }
})

const Item = mongoose.model('item', itemSchema)

module.exports = Item
