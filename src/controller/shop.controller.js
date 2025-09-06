const getDataUri = require("../utils/datauri");
const cloudinary = require('../config/cloudinary');
const Shop = require("../models/shop.model");


exports.createShop = async (req, res) => {

    try {
        const { name, phone, city, state, address, isOpen } = req.body;
        const shopImage = req.files && req.files.shopImage ? req.files.shopImage[0] : null

        // Validation
        if (!name || !city || !state || !address || !shopImage) {
            return res.status(400).json({ message: "Please provide all required fields including shop image" });
        }

        let imageUrl = null;

        if (shopImage) {
            const fileUri = getDataUri(shopImage)
            cloudResponse = await cloudinary.uploader.upload(fileUri, { folder: "shops", })
            imageUrl = cloudResponse.secure_url
        }

        const shop = await Shop.create({
            name,
            phone,
            city,
            state,
            address,
            isOpen: isOpen ?? true,
            shopImage: imageUrl,
            owner: req.user._id,
        })

        await shop.save()
        return res.status(201).json({
            message: "Shop created successfully",
            shop,
        });

    } catch (error) {
        console.error("Error creating shop:", error);
        return res.status(500).json({
            message: "Something went wrong while creating shop",
            error: error.message,
        });

    }
}

exports.getShop = async (req, res) => {
    try {
    const shop = await Shop.findOne({ owner: req.user._id }).populate("owner items");

        if (!shop) {
            return res.status(404).json({
                message: "Shop not found for this owner",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Shop fetched successfully",
            shop,
            success: true,
        });
    } catch (error) {
        console.error("Error fetching shop:", error);
        return res.status(500).json({
            message: "Something went wrong while fetching shop",
            error: error.message,
            success: false,
        });
    }
};

exports.editShop = async (req, res) => {

    try {
        const { shopId } = req.params;
        const { name, phone, city, state, address, isOpen } = req.body;
        const shopImage = req.files && req.files.shopImage ? req.files.shopImage[0] : null

        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        if (shopImage) {
            if (shopImage) {
                if (shop.shopImage) {
                    const publicId = shop.shopImage.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(`shops/${publicId}`);
                }


                const fileUri = getDataUri(shopImage);
                const cloudResponse = await cloudinary.uploader.upload(fileUri, { folder: "shops" });
                shop.shopImage = cloudResponse.secure_url;
            }

        }

        if (name) shop.name = name;
        if (phone) shop.phone = phone;
        if (city) shop.city = city;
        if (state) shop.state = state;
        if (address) shop.address = address;
        if (typeof isOpen !== "undefined") shop.isOpen = isOpen;
        await shop.save();

        return res.status(200).json({
            message: "Shop updated successfully",
            shop,
        });
    } catch (error) {
        console.error("Error updating shop:", error);
        return res.status(500).json({
            message: "Something went wrong while updating shop",
            error: error.message,
        });
    }

}