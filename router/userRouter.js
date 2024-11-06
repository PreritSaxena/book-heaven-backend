import express from 'express'
import user from "../models/userSchema.js"
import bcrypt from "bcryptjs"
import jsonwebtoken from 'jsonwebtoken';
import { authentication } from './userAuth.js';

const router = express.Router();

router.post("/sign-up", async(req,res) => {
    try{
        const {username, email, password , address} = req.body;
        //username check
        if(username.length < 4){
            return res.status(400).
            json({message : "username length should be greater than 3"})
        }

        //check username already exist
        const existingUsername = await user.findOne({username : username})
        if(existingUsername){
            return res.status(400).
            json({message : "username already exist"})
        }

        // check email already exist
        const existingEmail = await user.findOne({email : email})
        if(existingEmail){
            return res.status(400).
            json({message : "Email already exist"})
        }

        // check password length
        if(password.length<=5){
            return res.status(400).
            json({message : "Password length should be greater than 5"})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = new user({
            username: username,
            email: email,
            password: hashedPassword,
            address : address
        })
        await newUser.save();
        return res.status(200).json({message : "SignUp successfully"})
     }
    catch(err){
        res.status(500).json({message : "Internal Server Error" , err});
    }
})

router.post("/sign-in", async(req,res) => {
    try{
        const {username, password} = req.body;
        const existingUser = await user.findOne({username})
        if(!existingUser){
            res.status(400).json({message: "Invalid User Credentials"})
        }
        await bcrypt.compare(password, existingUser.password,  (err,data) => {
            if(data){
                const authClaim = [
                    {name : existingUser.username},
                    {role : existingUser.role}
                ]
                const token = jsonwebtoken.sign(
                    {authClaim},
                    "bookStore123" ,
                    {expiresIn: "30d"})
                res.status(200).json({id : existingUser._id , role:existingUser.role , token: token })
            }else{
                res.status(400).json({message : "Invalid Password"})    
            }
            
        })
     }
    catch(err){
        res.status(500).json({message : "Internal Server Error" , err});
    }
})

router.get("/get-user-info", authentication , async(req,res) => {
    try{
        const {id} = req.headers;
        const data = await user.findById(id).select("-password");
        return res.status(200).json(data);

    }
    catch(err){
        res.status(500).json({message: "Internal Server Error"})
    }
})

router.put("/update-address", authentication, async (req,res) => {
    try{
      const {id} = req.headers;
      const {address} = req.body;
      await user.findByIdAndUpdate(id , {address : address});
      res.status(200).json({message : "Address Updated Successfully"})
    }
    catch(err){
        res.status(500).json({message: "Internal Server Error"})
    }


})


export default router;
