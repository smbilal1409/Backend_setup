import mongoose, { Schema, Types } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoschema=new mongoose.Schema({
    videofile:{
        type:String,
        required:true
    },
    Thumnil:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"

    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        dafault:0
    },
    ispublished:{
        type:Boolean,
        default:true
    }

},
{
    timestamps:true
})
videoschema.plugin(mongooseAggregatePaginate);
export const Video=mongoose.model("Video",videoschema) 