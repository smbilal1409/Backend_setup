import mongoose, { Schema } from "mongoose";
const Playlistschema=new Schema({
    name:{
type:String,
required:true,
trim: true,
maxLength: [100, "Playlist name cannot exceed 100 characters"] 
},
description:{
type:String,
required:true,
trim: true,
maxLength: [500, "Playlist name cannot exceed 100 characters"] 
 },
 videos: [{  
    type: Schema.Types.ObjectId,
    ref: "Video"
}],
owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
}
},
{timestamps:true})
export const Playlist=mongoose.model("Playlist",Playlistschema)