import express from 'express'
import connection from './connection/connection.js';
import 'dotenv/config'
import router from './router/userRouter.js';
import bookRouter from './router/book.js';
import favouriteRouter from './router/favourite.js';
import cartRouter from './router/cartRouter.js';
import orderRouter from './router/oderRouter.js';
import cors from "cors";
// const express = require("express")
// require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 4000
connection()

app.use(cors());
app.use(express.json());
// routes
app.use("/api/v1" , router )
app.use("/api/v1" , bookRouter)
app.use("/api/v1" , favouriteRouter)
app.use("/api/v1" , cartRouter)
app.use("/api/v1" , orderRouter)

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})

app.get('/',(req,res) => {
    res.send("API working")
})


