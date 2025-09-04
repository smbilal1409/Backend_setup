import asynchandlerfunction from "../utils/asynchandler.js";
import { User } from "../models/user.models.js";
import ApiError from "../utils/Apierror.js";
import ApiResponse from "../utils/Apiresponse.js";
import { Comment } from "../models/comments.models.js";
import { Video } from "../models/videos.models.js";
const addcomment=asynchandlerfunction(async(req,res)=>{
    const{content}=req.body;
    if(!content){
        throw new ApiError(404,"content of comment is not found")
    }
    const{videoid}=req.params;
    const video=await Video.findById(videoid);
    if(!video){
        throw new ApiError(404,"video is not found");
    }
    
    const commentadded=await Comment.create({
        content:content,
        video:videoid,
        owner:req.user._id
    })
    const populatedComment = await Comment.findById(commentadded._id)
        .populate("owner", "username avatar fullname")
        .populate("video", "title"); 

    
    return res.status(201).json(
        new ApiResponse(201, populatedComment, "Comment successfully added")
    );
})
const updatecomment=asynchandlerfunction(async(req,res)=>{
const{commentid}=req.params;
const{content}=req.body
if(!content){
    throw new ApiError(405,"new content for the commnet is not found");
}
const comment=await Comment.findById(commentid);
if(!comment){
    throw new ApiError(407,"the video is not found");
}
if(comment.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403,"the owner of the comment and the peson who is going to chage the comment are not same");
}
comment.content=content;
await comment.save({validateBeforeSave: false})
return res.status(200)
.json(new ApiResponse(200,comment,"comment successfully updated"));

})
const deletecomment=asynchandlerfunction(async(req,res)=>{
    const{commentid}=req.params;
    const findcomment=await Comment.findById(commentid);
    if(!findcomment){
        throw new ApiError(404,"comment not found")
    }
    if(findcomment.owner.toString()!==req.user._id.toString()){
        throw new ApiError(405,"the person who added the comment and the person who s trying to change it are different")
    }
    const deletecomment=await Comment.findByIdAndDelete(commentid);
    return res.status(200)
    .json(new ApiResponse(200,deletecomment,"comment deleted successfully"))
})
export {
addcomment,
updatecomment,
deletecomment
} 