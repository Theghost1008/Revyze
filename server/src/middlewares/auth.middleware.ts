import { JwtPayload } from "../types/express.types.ts";
import { AuthRequest } from "../types/auth.types.ts";
import { Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.ts";

export const verifyJWT = async(
    req:AuthRequest,
    res:Response,
    next:NextFunction
)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success:false,
                message:"Access token missing"
            })
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET as string
        ) as JwtPayload
        const user = await User.findById(decoded.userId).select(
            "-password -refreshTokens"
        );
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found"
            })
        }
        req.user = user
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"Invalid or expired token"
        })
    }
}