
import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


/// placing user order from frontend

const placeOrder = async (req, res) => {

    const frontend_url = "http://localhost:5173";

    try {

        const { items, amount, address } = req.body;

        if (!items || items.length === 0 || !address) {
            return res.json({
                success: false,
                message: "Invalid order data"
            });
        }

        const newOrder = new orderModel({
            userId: req.userId,
            items: items,
            amount: amount,
            address: address
        });

        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: Math.round(item.price * 100 * 80)
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100 * 80
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        await userModel.findByIdAndUpdate(req.userId, {
            cartData: {}
        });

        res.json({
            success: true,
            session_url: session.url
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Error creating order"
        });

    }
};

const verifyOrder = async (req, res) => {

  

        const {orderId,success} = req.body;
        try {
            if (success=="true"){
                await orderModel.findByIdAndUpdate(orderId,{payment:true});
                res.json({success:true,message:"Paid"})
            }
            else{
                await orderModel.findByIdAndDelete(orderId);
                res.json({success:false,messege:"Not Paid"})
            }
        } catch (error) {
            console.log(error);
            res.json({success:false,message:"Error"})
        }
}
/// User orders for frontend

const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.userId});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

/// Listing orders for admin panel

const listOrders = async (req,res) =>{
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

/// api for updating order status

const updateStatus = async (req,res)=>{

}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}