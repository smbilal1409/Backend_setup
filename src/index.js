import mongoose from "mongoose";  
import { db_name } from "./constants.js"; 
import express from "express";
import dotenv from "dotenv";
import Connectdb from "./db/index.js";

dotenv.config({
    path: "./env"  
});
const app=express()

if (process.env.NODE_ENV !== "production") {
    console.log("Environment variables loaded:", process.env);
}
let port=process.env.PORT||8000;
Connectdb()
.then(()=>{
app.listen(port,()=>{
    console.log(`server running at the port ${port}`)
})
})
.catch((error)=>{
console.log("Mongodb connection failed");
})
