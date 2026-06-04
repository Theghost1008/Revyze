import { Request, Response } from "express";
import { registerUser } from "../services/auth.service.ts";

export const signup = async(req:Request,res:Response)=>{
    try{
        const {name,email,password} = req.body;
        const result = await registerUser({name,email,password});
        return res.status(201).json({
            success:true,
            message:"User registered successfully",
            data:result
        })
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message: error instanceof Error ? error.message : "Something went wrong while registering user"
        })
    }
}