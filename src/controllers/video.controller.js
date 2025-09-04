import asynchandlerfunction from "../utils/asynchandler.js";
import { User } from "../models/user.models.js";
import ApiError from "../utils/Apierror.js";
import ApiResponse from "../utils/Apiresponse.js";
import { Video } from "../models/videos.models.js";
import uploadoncloudinary from "../utils/cloudinary.js";
const uploadvideo=asynchandlerfunction(async(req,res)=>{
const{title ,description,ispublished=true}=req.body;
if(!title || !description){
    throw new ApiError(404,"description and the ttle is not found")
}
const user=await User.findById(req.user._id);
if(!user){
throw new ApiError(404,"User is not found")
}
if(!req.files || !req.files.videofile || !req.files.Thumnil){
    throw new ApiError(403,"the video and the thumnil file is not yet uploaded");
}
const videofilelocalpath=req.files.videofile[0]?.path;
const thumnilfilelocalpath=req.files.Thumnil[0]?.path;
if(!videofilelocalpath && !thumnilfilelocalpath){
    throw new ApiError(403,"the video and the thumnil local path not found");
}
const videoupload=await uploadoncloudinary(videofilelocalpath);
const thumnilupload=await uploadoncloudinary(thumnilfilelocalpath);
if(!videoupload){
    throw new ApiError(402,"video file not yet uploaded");
}
if(!thumnilupload){
    throw new ApiError(402,"thumnil file not yet uploaded");
}
const duration = Math.round(videoupload.duration)|| 0;
const video=await Video.create({
    title:title.trim(),
    description:description,
    videofile:videoupload.url,
    Thumnil:thumnilupload.url,
    owner:user._id,
    duration:duration,
    ispublished:ispublished===true||ispublished==="true",
    views:0
}
)
const videoWithOwner = await Video.findById(video._id).populate("owner", "username email");
res.status(200)
.json(new ApiResponse(200,videoWithOwner,"video uploaded successfully"))
})
const getvideobyid=asynchandlerfunction(async(req,res)=>{
    const{videoid}=req.params;
    const video=await Video.findById(videoid);
    if(!video){
        throw new ApiError(401,"video is not found");
    }
    return res.status(200)
    .json(new ApiResponse(200,video,"video successfully sended"));
})
const updatevideodetails=asynchandlerfunction(async(req,res)=>{
    const {videoid}=req.params;
    console.log("req.file:",req.file);
    console.log("req.body:",req.body);
const{title,description}=req.body;
    const findvideo=await Video.findById(videoid);
    if(!findvideo){
        throw new ApiError(404,"unable to find the video")
    }
    
if(!req.file && !title && !description){
    throw new ApiError(404,"the updated info is missing");
}
if(findvideo.owner.toString() !== req.user._id.toString()){
    throw new ApiError(404,"the user didnot match");
}
const thumnillocalpath=req.file?.path;
if(!thumnillocalpath){
    throw new ApiError(402,"Thumnil local path not found");
}
const uploadnewthumnil=await uploadoncloudinary(thumnillocalpath);
if(!uploadnewthumnil.url){
    throw new ApiError(404,"the cloudinary failed to upload the file")
}
const videodetailupdated=await Video.findByIdAndUpdate(
    videoid,
    {
        $set:{
            title:title,
            description:description,
            Thumnil:uploadnewthumnil.url
        }
    },
    {
        new:true
    }
    
)
res.status(200)
.json(new ApiResponse(200,videodetailupdated,"video details are successfully updated"));
})
const deletevideo=asynchandlerfunction(async(req,res)=>{
    const{videoid}=req.params;
    const video=await Video.findById(videoid);
    if(!video){
        throw new ApiError(405,"unable to find the video");
    }
    if(video.owner.toString()!==req.user._id.toString()){
        throw new ApiError(403,"The user of video and the owner doenot match")
    }
    const deletedvideo=await Video.findByIdAndDelete(videoid);
    res.status(200).json(new ApiResponse(200,deletedvideo,"video successfully deleted"))
})
export {uploadvideo,
    getvideobyid,
    updatevideodetails,
    deletevideo
}