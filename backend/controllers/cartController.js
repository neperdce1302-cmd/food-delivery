import userModel from "../models/userModel.js"

// add items to user cart
const addToCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let cartData = userData.cartData || {};
        const itemId = req.body.itemId;

        if (!itemId) {
            return res.status(400).json({
                success: false,
                message: "Item ID is required"
            });
        }

        if (!cartData[itemId]) {
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }

        await userModel.findByIdAndUpdate(
            req.userId,
            { cartData }
        );

        res.json({
            success: true,
            message: "Added To Cart",
            cartData
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error adding item to cart"
        });
    }
};
// remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let cartData = userData.cartData;
        const itemId = req.body.itemId;

        if (cartData[itemId] > 1) {
            cartData[itemId] -= 1;
        } else {
            delete cartData[itemId];
        }

        await userModel.findByIdAndUpdate(req.userId, { cartData });

        res.json({
            success: true,
            message: "Remove From Cart"
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// fetch user cart data

const getCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const cartData = userData.cartData;

        res.json({
            success: true,
            cartData
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error getting cart"
        });
    }
};

export {addToCart,removeFromCart,getCart}
