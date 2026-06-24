import mongoose,{Schema, Types, Document} from "mongoose";

export interface INoteVersion extends Document{
    noteId: Types.ObjectId;
    versionNumber: number;
    content: string;
}

const noteVersionSchema = new Schema <INoteVersion>({
    noteId:{
        type: Schema.Types.ObjectId,
        ref:"Note",
        required: true
    },
    versionNumber:{
        type: Number,
        required:true,
    },
    content:{
        type:String,
        default:""
    }
},{timestamps:true});

noteVersionSchema.index({noteId:1});
noteVersionSchema.index(
    {
        noteId:1,
        verionNumber:1
    },
    {
        unique:true
    }
)
const NoteVersion = mongoose.model<INoteVersion>("NoteVersion", noteVersionSchema);

export default NoteVersion;