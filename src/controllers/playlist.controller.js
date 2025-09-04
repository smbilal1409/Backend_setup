import asynchandlerfunction from "../utils/asynchandler.js";
import { User } from "../models/user.models.js";
import ApiError from "../utils/Apierror.js";
import ApiResponse from "../utils/Apiresponse.js";
import { Video } from "../models/videos.models.js";
import uploadoncloudinary from "../utils/cloudinary.js";
import { Playlist } from "../models/playlist.models.js";
const createPlaylist = asynchandlerfunction(async (req, res) => {
    const {name, description} = req.body
if(!name){
    throw new ApiError(404,"Name of the playist is not found")
}
const createmyPlaylist=await Playlist.create({
    name:name,
    description:description || "",
    owner:req.user._id
})
return res.status(200).json(new ApiResponse(200,createmyPlaylist,"playlist successfully created"));
    
})

const getUserPlaylists = asynchandlerfunction(async (req, res) => {
    const {userId} = req.params
    const playlists=await Playlist.find({owner:userId});
    if(playlists.length===0){
        throw new ApiError(401,"The user playlist not found");

    }
    return res.status(200)
    .json(new ApiResponse(200,playlists,"playlist of the user successfully sended"));
})

const getPlaylistById = asynchandlerfunction(async (req, res) => {
    const {playlistId} = req.params;
    const playist=await Playlist.findById(playlistId);
    if(!playist){
        throw new ApiError(404,"Playlist not found")
    }
    return res.status(200)
    .json(new ApiResponse(200,playist,"playlist has been sended by id"));
})

const addVideosToPlaylist = asynchandlerfunction(async (req, res) => {
    const { playlistId, videoIds } = req.params;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }

    
    const videoIdArray = videoIds.split(",");

    const userVideos = await Video.find({
        _id: { $in: videoIdArray },
        owner: req.user._id,
    });

    if (userVideos.length !== videoIdArray.length) {
        throw new ApiError(403, "You can only add your own videos to this playlist");
    }
    const uniqueVideos = videoIdArray.filter(
        (id) => !playlist.videos.includes(id)
    );

    playlist.videos.push(...uniqueVideos);
    await playlist.save();

    return res.status(200).json(new ApiResponse(200, playlist, "Videos added"));
});


const removeVideoFromPlaylist = asynchandlerfunction(async (req, res) => {
    const { playlistId, videoIds } = req.params; 
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }
    const videoIdArray = videoIds.split(",");
    const userVideos = await Video.find({ _id: { $in: videoIdArray }, owner: req.user._id });
    if (userVideos.length !== videoIdArray.length) {
        throw new ApiError(403, "You can only remove your own videos from this playlist");
    } 
    playlist.videos = playlist.videos.filter(
        (id) => !videoIdArray.includes(id.toString())
    );
    await playlist.save({ validateBeforeSave: false });
    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Videos removed from playlist successfully"));
});


const deletePlaylist = asynchandlerfunction(async (req, res) => {
    const {playlistId} = req.params
    const playlist=await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(405,"playlist is no found")
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this playlist");
    }
    const deletethePlaylist=await Playlist.findByIdAndDelete(playlistId);
    res.status(200)
    .json(new ApiResponse(200,deletethePlaylist,"playlsit has been successfully deleted"))
})

const updatePlaylist = asynchandlerfunction(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    const playist=await Playlist.findById(playlistId);
    if(!playist){
        throw new ApiError(402,"playlist not found");
    }
    if(playist.owner.toString()!==req.user._id.toString()){
        throw new ApiError(401,"the user and the owner of the playlist not match");
    }
    const updatedplayist=await Playlist.findByIdAndUpdate(playlistId,
        {
            $set:{
                name:name,
                description:description
            }
        },
        {new:true}
    )
    return res.status(200)
    .json(new ApiResponse(200,updatedplayist,"the playlist has been successfully updated"));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideosToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}