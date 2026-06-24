import mongoose,{Schema, Types, Document} from "mongoose";

export interface INote extends Document {
    owner: Types.ObjectId;
    title: string;
    tags: string[];
    category: "DSA"
    | "Web Development"
    | "Cybersecurity"
    | "DevOps"
    | "Cloud"
    | "AI/ML"
    | "Databases"
    | "OS"
    | "Networking"
    | "System Design"
    | "Programming Languages"
    | "Other";
    knowledgeLevel: "Beginner" | "Intermediate" | "Advanced";
    description: string;
    isArchived:boolean;
    latestVersion?: Types.ObjectId;
    totalVersions: number;
}

const noteSchema = new Schema<INote>({
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    title:{
        type: String,
        required: true,
    },
    tags:{
        type:[String],
        default: []
    },
    category:{
        type:String,
        enum: ["DSA"
        , "Web Development"
        , "Cybersecurity"
        , "DevOps"
        , "Cloud"
        , "AI/ML"
        , "Databases"
        , "OS"
        , "Networking"
        , "System Design"
        , "Programming Languages"],
        default:"Other"
    },
    knowledgeLevel:{
        type:String,
        enum:["Beginner", "Intermediate", "Advanced"],
    },
    description:{
        type:String,
        default:""
    },
    isArchived:{
        type:Boolean,
        default: false,
    },
    latestVersion:{
        type: Schema.Types.ObjectId,
        ref:"NoteVersion",
    },
    totalVersions:{
        type:Number,
        default:0
    }
},{timestamps:true});

const Note = mongoose.model<INote>("Note", noteSchema);

export default Note;