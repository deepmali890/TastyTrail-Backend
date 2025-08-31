const User = require("../models/user.model");


// Controller: Get Current User
// Returns the authenticated user details (except password)
exports.getCurrentUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            message: "Current user fetched successfully.",
            user
        });

    } catch (error) {
        console.error("Get current user error:", error);
        res.status(500).json({ message: "Server error while fetching current user." });
    }
};
