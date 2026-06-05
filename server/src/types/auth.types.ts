import { Request } from "express";
import { IUser } from "../models/user.model.ts";

export interface AuthRequest extends Request{
    user?:IUser,
};