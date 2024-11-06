import mongoose from "mongoose"

const order = new mongoose.Schema({

    user:{
        type:mongoose.Types.ObjectId,
        ref:'user',
    },
    book:{
        type:mongoose.Types.ObjectId,
        ref:'books',
    },
    status:{
        type:String,
        enum:["Order placed" ,  "Out for Delivery" , "Delivered", "Cancelled"],
        default : "Order placed"
    }
},
{timeStamps: true}
)

export default mongoose.model("order", order);
