import mongoose, { Schema } from "mongoose";
const Tweetschema=new Schema({
owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
},
content:{
type:String,
required:true
}
},
{timestamps:true})
export const Tweet=mongoose.model("Tweet",Tweetschema) 