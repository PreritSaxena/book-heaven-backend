import express from "express";
import { authentication } from './userAuth.js';
import user from "../models/userSchema.js"

const cartRouter = express.Router();

cartRouter.put('/add-to-cart' , authentication , async(req,res) => {
    try{
        const {id, bookid} = req.headers;
        const userData = await user.findById(id);
        const isBookInCart = userData.cart.includes(bookid);
        if(isBookInCart){
            return res.status(200).json({message : "Book Already in Cart"})
        }
        await user.findByIdAndUpdate(id , {$push : {cart: bookid}});
        return res.status(200).json({message : "Book Added to Cart"}) 
    }
    catch(err){
        return res.status(500).json({message : "Internal Server Error"});
    }
})

cartRouter.put('/remove-from-cart/:bookid' , authentication , async(req,res) => {
    try{
        const {bookid} = req.params;
        const {id} = req.headers;
        
        await user.findByIdAndUpdate(id , {$pull : {cart: bookid}});
        return res.status(200).json({message : "Book Removed from cart"}) 
    }
    catch(err){
        return res.status(500).json({message : "Internal Server Error"});
    }
})

cartRouter.get("/get-user-cart" , authentication , async(req,res) => {
    try{
        const {id} = req.headers;
        const userData =  await user.findById(id).populate("cart");
        const cart = userData.cart.reverse();
        return res.json({
            status : "success",
            data : cart
        })
    }
    catch(err){
        return res.status(500).json({message : "Internal Server Error"})
    }
})

 

export default cartRouter