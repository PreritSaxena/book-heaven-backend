// const mongoose = require("mongoose")
import mongoose from "mongoose";

const connection = async () => {
    try{
        await mongoose.connect(`${process.env.URI}/bookStore`)
        console.log("connected to db")
    }
    catch(err){
        console.log(err)
    }
}
export default connection
// connection()