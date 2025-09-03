const getDataUri = require("../utils/datauri");
const cloudinary = require('../config/cloudinary');
const Item = require("../models/item.model");
const Shop = require("../models/shop.model");


exports.addItems = async (req, res) => {
    try {

        const { name, price, available, spiceLevel, category, foodType } = req.body;
        const itemImage = req.files && req.files.itemImage ? req.files.itemImage[0] : null

        if (!name || !price || !category || !foodType || !itemImage) {
            return res.status(400).json({
                message: "Please provide all required fields:",
                success: false,
            });
        }

        let imageUrl = null;
        if (itemImage) {
            const fileUri = getDataUri(itemImage)
            cloudResponse = await cloudinary.uploader.upload(fileUri, { folder: "itemsImages", })
            imageUrl = cloudResponse.secure_url;
        }

        const shop = await Shop.findOne({ owner: req.user._id });
        if (!shop) {
            return res.status(404).json({
                message: "Shop not found for this owner",
                success: false,
            });
        }

        21
        const item = await Item.create({
            name,
            price,
            available: available ?? true,
            spiceLevel: spiceLevel ?? "Medium",
            category,
            foodType,
            itemImage: imageUrl,
            shop: shop._id,
        })
        shop.items.push(item._id)
        await shop.save()

        return res.status(201).json({
            message: "Item added successfully",
            item,
            success: true,
        });
    } catch (error) {
        console.error("Error adding item:", error);
        return res.status(500).json({
            message: "Something went wrong while adding item",
            error: error.message,
            success: false,
        });
    }

}

exports.getItems = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.user._id }).populate("items")
        if (!shop) {
            return res.status(404).json({
                message: "Shop not found for this owner",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Items fetched successfully",
            items: shop.items,
            success: true,
        });

    } catch (error) {
        console.error("Error fetching items:", error);
        return res.status(500).json({
            message: "Something went wrong while fetching items",
            error: error.message,
            success: false,
        });
    }

}

exports.editItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { name, price, available, spiceLevel, category, foodType } = req.body;

        const itemImage = req.files && req.files.itemImage ? req.files.itemImage[0] : null

        const item = await Item.findById(itemId)
        if (!item) {
            return res.status(404).json({
                message: "Item not found",
                success: false,
            });
        }

        if (itemImage) {
            if (itemImage) {
                if (item.itemImage) {
                    const publicId = item.itemImage.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(`itemsImages/${publicId}`)
                }
                const fileUri = getDataUri(itemImage);
                const cloudResponse = await cloudinary.uploader.upload(fileUri, { folder: "itemsImages" });
                item.itemImage = cloudResponse.secure_url;
            }
        }

        if (name) item.name = name;
        if (price) item.price = price;
        if (available !== undefined) item.available = available; 
        if (spiceLevel) item.spiceLevel = spiceLevel;
        if (category) item.category = category;
        if (foodType) item.foodType = foodType;

        await item.save();

        return res.status(200).json({
            message: "Item updated successfully",
            item,
            success: true,
        });
    } catch (error) {
        console.error("Error updating item:", error);
        return res.status(500).json({
            message: "Something went wrong while updating item",
            error: error.message,
            success: false,
        });
    }
}