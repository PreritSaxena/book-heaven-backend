import express from 'express'
import user from "../models/userSchema.js"
import books from '../models/bookSchema.js';
import { authentication } from './userAuth.js';

const bookRouter = express.Router();
 
// adding new book (admin)
bookRouter.post("/add-book" , authentication  , async(req,res) => {
    try{

        const {id} = req.headers;
        const userId = await user.findById(id); 

        if(userId.role !== 'admin'){
           return res.status(500).json({message : "Only Admin can perform such action" , err});
        }

        const book = new books({
            url : req.body.url,
            title : req.body.title,
            author : req.body.author,
            price : req.body.price,
            desc : req.body.desc,
            language: req.body.language 
        });
        await book.save();
        res.status(200).json({message: "Book Added Successfully"})
    }
    catch(err){
        res.status(500).json({message : "Internal Server Error" , err});
    }
})

//update book (admin)
bookRouter.put("/update-book", authentication, async (req, res) => {
    try {
        const { bookid } = req.headers;  // Use body instead of headers

        if (!bookid) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        const updatedBook = await books.findByIdAndUpdate(
            bookid,
            {
                url: req.body.url,
                title: req.body.title,
                author: req.body.author,
                price: req.body.price,
                desc: req.body.desc,
                language: req.body.language
            },
            { new: true }  // Return the updated document
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json({ message: "Book updated successfully", book: updatedBook });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred", error: err });
    }
});

//delete book (admin)
bookRouter.delete("/delete-book" , authentication , async (req,res) => {
    try{
        const {bookid} = req.headers;

        if(!bookid){
            return res.status(400).json({ message: "Book ID is required" });
        }

        await books.findByIdAndDelete(bookid);
        return res.status(200).json({message : "Book Deleted Successfully"})
    }
    catch(err){
        return res.status(500).json({message: "Internal Server Error"})
    }
})

//all books data (public)
bookRouter.get("/get-all-books"  , async(req,res) => {
    try{
        const allBooks = await books.find().sort({createdAt : -1});
        return res.status(200).json({message : "All Books" , data : allBooks});
    }
    catch(err){
        return res.status(200).json({message: "Internal Server Error"})
    }
})

// recent added book - 4(public)
bookRouter.get("/get-recent-books"  , async(req,res) => {
    try{
        const recentBooks = await books.find().sort({createdAt : -1}).limit(4);
        return res.status(200).json({message : "All Books" , data : recentBooks});
    }
    catch(err){
        return res.status(500).json({message: "Internal Server Error"})
    }
})

// find book by id(public)
bookRouter.get("/get-book-by-id/:id"  , async(req,res) => {
    try{
        const {id} = req.params;
        const book =  await books.findById(id);
        return res.status(200).json({message: "Book Details" , data : book})
    } 
    catch(err){
        res.status(500).json({message : "Internal Server Error"})
    }
})

export default bookRouter;
