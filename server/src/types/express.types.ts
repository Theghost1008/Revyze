export interface JwtPayload{
    userId:string,
    role:"User" | "Admin"
};