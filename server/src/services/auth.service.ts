import User from "../models/user.model.ts";
import bcrypt from "bcryptjs";

interface RegisterUserInput{
    name: string,
    email: string,
    password: string,
}
interface LoginUserInput{
    email:string,
    password:string,
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