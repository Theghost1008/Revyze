import { Request, Response } from "express";
import { registerUser,loginUser, logoutUser,refreshAccessToken } from "../services/auth.service.ts";
import { AuthRequest } from "../types/auth.types.ts";

export const signup = async(req:Request,res:Response)=>{
    try{
        const {name,email,password} = req.body;
        const result = await registerUser({name,email,password});
        res.cookie("refreshToken",result.refreshToken,{
            httpOnly:true,
            secure: process.env.NODE_ENV == "production",
            sameSite: "strict",
            maxAge: 7*24*60*60*1000
        })
        const {refreshToken, ...responseData } = result
        return res.status(201).json({
            success:true,
            message:"User registered successfully!",
            data:responseData
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
        res.cookie("refreshToken",result.refreshToken,{
            httpOnly:true,
            secure: process.env.NODE_ENV == "production",
            sameSite: "strict",
            maxAge: 7*24*60*60*1000
        })
        const {refreshToken, ...responseData } = result
        return res.status(200).json({
            success:true,
            message:"Logged in successfully!",
            data:responseData
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
        success:true,
        data:req.user
    })
}

export const logout = async(
    req:AuthRequest,
    res:Response
)=>{
    try{
        const refreshToken = req.cookies?.refreshToken;
        if(!refreshToken){
            res.clearCookie("refreshToken");
            return res.status(200).json({
                success:true,
                message:"Already logged out"
            })
        }
        const result = await logoutUser({
                userId:req.user!._id.toString(),
                refreshToken
            })
        res.clearCookie("refreshToken")
        return res.status(200).json(result);
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message: error instanceof Error ? error.message:"Something went wrong while logging out"
        })
    }
}

export const refresh = async(
    req:AuthRequest,
    res:Response
)=>{
    try{
        const refreshToken = req.cookies?.refreshToken;
        const result = await refreshAccessToken({refreshToken});
        res.cookie("refreshToken", result.refreshToken,
            {
                httpOnly:true,
                secure:process.env.NODE_ENV=="production",
                sameSite:"strict"
            }
        )
        return res.status(200).json({
            success:true,
            message:"Token refreshed",
            accessToken : result.accessToken
        })
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message: error instanceof Error ? error.message : "Unable to refresh token"
        })
    }
}