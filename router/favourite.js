import express from 'express'
import user from "../models/userSchema.js"
import { authentication } from './userAuth.js';

const favouriteRouter = express.Router();

// add book to favourite
favouriteRouter.put('/add-book-to-favourite' , authentication , async(req,res) => {
    try{
        const {id, bookid} = req.headers;
        const userData = await user.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);
        if(isBookFavourite){
            return res.status(200).json({message : "Book Already in Favourites"})
        }
        await user.findByIdAndUpdate(id , {$push : {favourites: bookid}});
        return res.status(200).json({message : "Book Added to Favourites"}) 
    }
    catch(err){
        return res.status(500).json({message : "Internal Server Error"});
    }
})

// delete book from favourite
favouriteRouter.put('/remove-book-to-favourite' , authentication , async(req,res) => {
    try{
        const {id, bookid} = req.headers;
        const userData = await user.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);

        if(isBookFavourite){
            await user.findByIdAndUpdate(id , {$pull : {favourites: bookid}});
        }
        return res.status(200).json({message : "Book Removed from Favourites"}) 
    }
    catch(err){
        return res.status(500).json({message : "Internal Server Error"});
    }
})

// show all book that are added in Favourite
favouriteRouter.get("/get-favourite-books" , authentication , async(req,res) => {
    try{
        const {id} = req.headers;
        const userData =  await user.findById(id).populate("favourites");
        const favouriteBooks = userData.favourites;
        return res.json({
            status : "success",
            data : favouriteBooks
        })
    }
    catch(err){
        return res.status(500).json({message : "Internal Server Error"})
    }
})

export default favouriteRouter