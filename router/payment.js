import express from 'express'
import 'dotenv/config'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.SECRET_STRIPE_KEY);
const router = express.Router();

router.post("/payment" , async (req,res) => {
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode:'payment',
            line_items:req.body.items.map(item=> {
                return{
                    price_data:{
                        currency: 'inr',
                        product_data:{
                            name:item.name
                        },
                        unit_amount:(item.price)*100,
                    },
                    quantity:item.quantity
                }
            }),
            success_url : "https://book-store-prerit.netlify.app/success",
            cancel_url : 'https://book-store-prerit.netlify.app/cancel'
        })
        res.json({url: session.url})
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
})

export default router;