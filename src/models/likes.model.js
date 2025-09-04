import mongoose, { Schema, Types } from "mongoose";
const likeschema=new Schema({
comment:{
    type:Schema.Types.ObjectId,
    ref:"comment"
},
video:{
    type:Schema.Types.ObjectId,
    ref:"Video" 
},
likedby:{
    type:Schema.Types.ObjectId,
    ref:"User"
},
tweet:{
    type:Schema.Types.ObjectId,
    ref:"Tweet"
},
},{
    timestamps:true
})
export const Like=mongoose.model("Like",likeschema);