import ApiError from "../utils/Apierror.js";
import ApiResponse from "../utils/Apiresponse.js";
import { Like } from "../models/likes.model.js";
import uploadoncloudinary from "../utils/cloudinary.js";
import { Comment } from "../models/comments.models.js";
import { Tweet } from "../models/tweets.models.js";
import { Video } from "../models/videos.models.js";
import asyncHandler from "../utils/asynchandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const checkvideolike=await Like.findOne({
        video:videoId,
        likedby:req.user._id
    })
    if(checkvideolike){
        await Like.findByIdAndDelete(checkvideolike._id)
        res.status(200)
        .json(new ApiResponse(200,null,"user removed like"));
    }
    else{
        const creatvideolike=await Like.create({
            video:videoId,
            likedby:req.user._id
        })
        res.status(200)
        .json(new ApiResponse(200,creatvideolike,"user liked the video"));
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const findlikeoncomment=await Like.findOne({
        comment:commentId,
        likedby:req.user._id
    })
if(findlikeoncomment){
    await Like.findByIdAndDelete(findlikeoncomment._id)
    res.status(200)
    .json(new ApiResponse(200,null,"user removed the like"))
}
else{
const commentlike=await Like.create({
    likedby:req.user._id,
    comment:commentId
})
res.status(200)
    .json(new ApiResponse(200,commentlike,"user liked the comment"))
}
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    
    const findlikeontweet=await Like.findOne({
        tweet:tweetId,
        likedby:req.user._id
    })
if(findlikeontweet){
    await Like.findByIdAndDelete(findlikeontweet._id)
    res.status(200)
    .json(new ApiResponse(200,null,"user removed the like on tweet"))
}
else{
const tweetlike=await Like.create({
    likedby:req.user._id,
    tweet:tweetId
})
res.status(200)
    .json(new ApiResponse(200,tweetlike,"user liked the tweet"))
}
    
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedvideos=await Like.find({
        likedby:req.user._id,
        video:{$ne:null}
    }).populate("video")
    if(!likedvideos || likedvideos.length===0){
        return res.status(200)
        .json(200,[],"no liked video found");
    }
    else{
        return res.status(200)
        .json(new ApiResponse(200,likedvideos,"liked video successfully sended"));
    }
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}