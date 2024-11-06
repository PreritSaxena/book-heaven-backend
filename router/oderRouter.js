import express from "express";
import { authentication } from './userAuth.js';
import books from '../models/bookSchema.js';
import user from "../models/userSchema.js"
import Order from "../models/orderSchema.js";


const orderRouter = express.Router();

orderRouter.post("/place-order" , authentication , async(req,res) => {
    try{
        const {id} = req.headers;
        const {order} = req.body;
  
        for(const orderData of order){
          const newOrder = new Order({
            user : id,
            book : orderData._id
          })   

          const orderDataFromDB = await newOrder.save();

          //saving order in user model
          await user.findByIdAndUpdate(id , {
            $push : {orders: orderDataFromDB._id},
          })

         //clearing cart
         await user.findByIdAndUpdate(id , {
            $pull : {cart: orderData._id},
          })
        }
          return res.json({
            status : "success",
            message: "Order placed Successfully"
          })
    }
    catch(err){
        return res.status(500).json({message: "Internal Server Error"})
    }
})

orderRouter.get("/get-order-history", authentication, async (req, res) => {
    try {
        const { id } = req.headers;
        
        // Find the user by ID and populate the 'orders' field with referenced 'book' details
        const userData = await user.findById(id).populate({
            path: "orders",
            populate: { path: "book" }
        });

        // Check if the user or orders data exists
        if (!userData || !userData.orders) {
            return res.status(404).json({
                status: "error",
                message: "User or orders not found"
            });
        }

        // Reverse the order data (optional) and return it
        const orderData = userData.orders.reverse();

        return res.json({
            status: "success",
            data: orderData
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
});


orderRouter.get("/get-all-orders" , authentication , async(req,res) => {
    try{
       const userData = await Order.find().
        populate({
            path : "book",
        })
        .populate({
            path : "user"
        })
        .sort({createdAt  : -1})
     
     return res.json({
        status : "success",
        data : userData
     })
    }
    catch(err){
        return res.status(500).json({message : "Internal Server Error"})
    }
    
})

orderRouter.put("/update-status/:id" , authentication , async(req,res) => {
    try{
    const {id} = req.params;
    await Order.findByIdAndUpdate(id , {status : req.body.status})
    return res.json({
        status : "success",
        message: "Status Updated Successfully"
    })
    }
    
    catch(err){
        return res.status(500).json({message : "Internal Server Error"})
    }
})


export default orderRouter