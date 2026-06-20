import User from "../models/user.model.ts";
import bcrypt from "bcryptjs";
import jwt,{JwtPayload} from "jsonwebtoken";

interface RegisterUserInput{
    name: string,
    email: string,
    password: string,
}
interface LoginUserInput{
    email:string,
    password:string,
}
interface LogoutUser{
    userId:string,
    refreshToken:string,
}
interface RefreshAT{
    refreshToken:string,
}
interface RefeshTokenPayload extends JwtPayload{
    userId:string,
}

export const registerUser = async function({
    name,
    email,
    password,
}:RegisterUserInput){
    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new Error("User with this email already exists!");
    }
    const user = await User.create({
        name,
        email,
        password
    })
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    const hashedRefreshToken = await bcrypt.hash(
        refreshToken,
        10
    );
    user.refreshTokens.push(hashedRefreshToken);
    await user.save();
    return {
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            currentStreak:user.currentStreak
        },
        accessToken,
        refreshToken
    };
};

export const loginUser = async function({
    email,
    password
}:LoginUserInput){
    const foundUser = await User.findOne({email});
    if(!foundUser)
        throw new Error("Invalid credentials");
    const tryLogin = await foundUser.comparePassword(password);
    if(!tryLogin)
        throw new Error("Invalid credentials");
    const accessToken = foundUser.generateAccessToken();
    const refreshToken = foundUser.generateRefreshToken()
    const hashedRefreshToken = await bcrypt.hash(
        refreshToken,
        10
    );
    foundUser.refreshTokens.push(hashedRefreshToken);
    await foundUser.save();
    return {
        user:{
            id:foundUser._id,
            name:foundUser.name,
            email:foundUser.email,
            role:foundUser.role,
            currentStreak:foundUser.currentStreak,
            profilePhoto:foundUser.profilePhoto
        },
        accessToken,
        refreshToken
    };
}

export const logoutUser = async function({
    userId,
    refreshToken
}:LogoutUser){
    const foundUser = await User.findById(userId);
    if(!foundUser)
        throw new Error("User not found");
    let tokenFound = false;
    const updatedTokens:string[] = [];
    for(const stored of foundUser.refreshTokens){
        const isMatch = await bcrypt.compare(
            refreshToken,
            stored
        )
        if(isMatch){
            tokenFound = true;
            continue;
        }
        updatedTokens.push(stored);
    }
    foundUser.refreshTokens = updatedTokens;
    await foundUser.save();
    return {
        success:true,
        message: tokenFound ? "Logged out successfully" : "Already logged out"
    }
}

export const refreshAccessToken = async function({
    refreshToken
}:RefreshAT){
    if(!refreshToken)
        throw new Error("Refresh token is missing");
    const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
    )as RefeshTokenPayload;
    const foundUser = await User.findById(decoded.userId);
    if(!foundUser)
        throw new Error("User not found");
    let matchTokenHash :string | null = null;
    for(const stored of foundUser.refreshTokens){
        const isMatch = await bcrypt.compare(
            refreshToken,stored
        );
        if(isMatch){
            matchTokenHash = stored;
            break;
        }
    }
    if(!matchTokenHash)
            throw new Error("Invalid refresh token");
    const newAccessToken = foundUser.generateAccessToken();
    const newRefreshToken = foundUser.generateRefreshToken();
    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken,10);
    foundUser.refreshTokens = foundUser.refreshTokens.map(token=>
        token==matchTokenHash ? hashedNewRefreshToken : token
    );
    await foundUser.save();
    return {
        accessToken : newAccessToken,
        refreshToken : newRefreshToken
    }
}