import asynchandlerfunction from "../utils/asynchandler.js";
import { upload } from "../middlewares/multer.middleware.js";
import ApiError from "../utils/Apierror.js";
import ApiResponse from "../utils/Apiresponse.js";
import { User } from "../models/user.models.js";
import uploadoncloudinary from "../utils/cloudinary.js";
const registeruser=asynchandlerfunction(async(req,res)=>{
const {username,email,fullname,password}=req.body;
console.log("email:",email);

if (
    [fullname, username, password, email].some((field) => 
      field?.trim() === "" || field === null || field === undefined
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
const existed_user=await User.findOne({
    $or: [{email}, {username}]
})
if(existed_user){
    throw new ApiError(409,"user with this email and username already exist");
}
console.log(req.files);
const avatarlocalpath=req.files?.avatar[0]?.path;
// const coverimagelocalpath=req.files?.coverimage[0]?.path;
let coverimagelocalpath;
if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length>0){
    coverimagelocalpath=req.files.coverimage[0].path
}
if(!avatarlocalpath){
    throw new ApiError(400,"Avatar localpath is required");
}
const avatar=await uploadoncloudinary(avatarlocalpath);
const coverimage=await uploadoncloudinary(coverimagelocalpath);
if(!avatar){
    throw new ApiError(400,"Avatar is required");
}
const usercreated=await User.create({
    fullname,
    avatar:avatar.url,
    coverimage:coverimage?.url || "",
    email,
    username:username.toLowerCase(),
    password
})
const createduser=await User.findById(usercreated._id).select(
    "-password -refreshToken"
)
if(!createduser){
    throw new ApiError(500,"something went wrong whie registring the user");
}
return res.status(201).json(
    new ApiResponse(201,createduser,"user successfully created")
);
});

export default registeruser;