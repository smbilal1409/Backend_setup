import mongoose from "mongoose"
import { Video } from "../models/videos.models.js"
import {Subscription} from "../models/subscription.model.js"
import { Like } from "../models/likes.model.js"
import ApiError from "../utils/Apierror.js"
import ApiResponse from "../utils/Apiresponse.js"
import asyncHandler from "../utils/asynchandler.js"
const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user._id; // current user's channel
  
    // ✅ 1. Aggregate total videos & total views
    const videoStats = await Video.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
      {
        $group: {
          _id: null,
          totalVideos: { $sum: 1 },
          totalViews: { $sum: "$views" }
        }
      }
    ]);
  
    // ✅ 2. Count subscribers
    const subscriberCount = await Subscription.countDocuments({
      channel: channelId
    });
  
    // ✅ 3. Count likes across all channel videos
    const likeStats = await Like.aggregate([
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "videoData"
        }
      },
      { $unwind: "$videoData" },
      {
        $match: { "videoData.owner": new mongoose.Types.ObjectId(channelId) }
      },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: 1 }
        }
      }
    ]);
  
    // ✅ 4. Per-video breakdown (views + likes per video)
    const perVideoStats = await Video.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "video",
          as: "likes"
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          views: 1,
          likesCount: { $size: "$likes" },
          createdAt: 1
        }
      }
    ]);
  
    // ✅ Final stats object
    const stats = {
      totalVideos: videoStats[0]?.totalVideos || 0,
      totalViews: videoStats[0]?.totalViews || 0,
      totalSubscribers: subscriberCount || 0,
      totalLikes: likeStats[0]?.totalLikes || 0,
      perVideoStats
    };
  
    return res
      .status(200)
      .json(new ApiResponse(200, stats, "Channel stats fetched successfully"));
  });

const getChannelVideos = asyncHandler(async (req, res) => {
   const getallvideosofchannel=await Video.find({
    owner:req.user._id,
    
   })

if(!getallvideosofchannel || getallvideosofchannel.length===0){
    res.status(207)
    .json(new ApiResponse(207,[],"no video found in the cahnnel"))
}
else{
    res.status(200)
    .json(new ApiResponse(200,getallvideosofchannel,"all videos of the channel successfully sended"))
}
})

export {
    getChannelStats, 
    getChannelVideos
    }