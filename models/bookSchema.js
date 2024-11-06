import mongoose from "mongoose"

const books = new mongoose.Schema({

    url:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    desc:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true,
    },
    
},
{timeStamps: true}
)

export default mongoose.model("books", books);
