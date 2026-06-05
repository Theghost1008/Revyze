import mongoose,{Document, Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validate from "validator";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;

    profilePhoto: string;

    role: "User" | "Admin";

    currentStreak: number;

    refreshTokens: string[];

    comparePassword(candidatePassword: string): Promise<boolean>;

    generateAccessToken(): string;

    generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        validate:{
            validator: (value:string)=> validate.isEmail(value),
            message:"Please enter a valid email!"
        }
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    profilePhoto:{
        type:String,
        default:""
    },
    role:{
        type:String,
        enum:["User","Admin"],
        default:"User"
    },
    currentStreak:{
        type:Number,
        default:0
    },
    refreshTokens:{
        type:[String],
        default: []
    }
},{timestamps:true})

userSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return;
    }
    this.password = await bcrypt.hash(this.password,10);
})


userSchema.methods.comparePassword = async function(
    candidatePassword:string
):Promise<boolean>{
    return await bcrypt.compare(candidatePassword,this.password);
}

userSchema.methods.generateAccessToken = function (): string {

    return jwt.sign(
        {
            userId: this._id,
            role: this.role
        },
        process.env.JWT_ACCESS_SECRET as string,
        {
            expiresIn: "15m"
        }
    );

};

userSchema.methods.generateRefreshToken = function (): string {

    return jwt.sign(
        {
            userId: this._id
        },
        process.env.JWT_REFRESH_SECRET as string,
        {
            expiresIn: "7d"
        }
    );

};

const User = mongoose.model<IUser>("User",userSchema);

export default User;