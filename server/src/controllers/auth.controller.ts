import { Request, Response } from "express";
import { registerUser,loginUser } from "../services/auth.service.ts";
import { AuthRequest } from "../types/auth.types.ts";

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
        console.error(error);//remove while in production
        return res.status(400).json({
            success:false,
            message: error instanceof Error ? error.message : "Something went wrong while registering user"
        })
    }
}

export const login = async(req:Request,res:Response)=>{
    try{
        const {email,password} = req.body;
        const result = await loginUser({email,password});
        return res.status(200).json({
            success:true,
            message:"Logged in successfully!",
            data:result
        })
    }
    catch(error){
        console.error(error);//remove while in production
        return res.status(400).json({
            success:false,
            message:error instanceof Error ? error.message:"Something went wrong while logging in"
        })
    }
}

export const getMe = async(
    req:AuthRequest,
    res:Response
)=>{
    return res.status(200).json({
        succcess:true,
        data:req.user
    })
}