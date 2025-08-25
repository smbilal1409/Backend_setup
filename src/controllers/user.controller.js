import asynchandlerfunction from "../utils/asynchandler.js";
import { upload } from "../middlewares/multer.middleware.js";
import ApiError from "../utils/Apierror.js";
import ApiResponse from "../utils/Apiresponse.js";
import { User } from "../models/user.models.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import uploadoncloudinary from "../utils/cloudinary.js";
const accessandrefreshtokenfunction=async(userid)=>{
try {
    const user=await User.findById(userid);
    const accessToken=user.generate_access_token();
    const refreshToken=user.generate_refesh_token();
    return{accessToken,refreshToken}
} catch (error) {
    throw ApiError(500,"your request is incorrect");
}
}

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
const loginuser=asynchandlerfunction(async(req,res)=>{
    const {username,email,password}=req.body;
    console.log(email);
    if(!username && !email){
        throw new ApiError(401,"username or email does not exist");
    }
    const userexisted=await User.findOne({
        $or:[{username},{email}]
    })
    if(!userexisted){
        throw new ApiError(404,"user doesnot exist");

    }
 const ispassword=await userexisted.isPasswordCorrect(password);
 if(!ispassword){
    throw new ApiError(403,"The password is incorrect");
 }

 const{accessToken,refreshToken}=await accessandrefreshtokenfunction(userexisted._id);
 const loggedinuser=await User.findById(userexisted._id).select("-password -refreshtoken");
 const option={
httpOnly:true,
secure:true
 }
 return res.status(200)
 .cookie("accessToken",accessToken,option)
 .cookie("refreshToken",refreshToken,option)
 .json(
    new ApiResponse(200,
        {user:loggedinuser,refreshToken,accessToken},
        "user logged in successfully"
    )
 )
});
const logoutuser=asynchandlerfunction(async(req,res)=>{
await User.findByIdAndUpdate(req.user._id,
    {
        $set:{
            refreshtoken:undefined
        },
    },
       { new:true}
)
    const option={
        httpOnly:true,
        secure:true
         }
         return res.status(200)
         .clearCookie("accessToken",option)
         .clearCookie("refreshToken",option)
         .json(new ApiResponse(200,{},"user logged out"))

})

export {
    registeruser,
    loginuser,
    logoutuser
}