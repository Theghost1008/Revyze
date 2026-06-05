import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/auth.route.ts";
import cookieParser from "cookie-parser";

dotenv.config();

connectDB();

const app=express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

app.get("/",(req,res)=>{
    res.send("API running...")
});

app.use("/api/v1/auth",router)

app.listen(PORT,()=>{
    console.log(`Server is runnning at port:${PORT}`);
});