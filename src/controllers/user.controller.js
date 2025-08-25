import asynchandlerfunction from "../utils/asynchandler.js";
import { upload } from "../middlewares/multer.middleware.js";
import ApiError from "../utils/Apierror.js";
import ApiResponse from "../utils/Apiresponse.js";
import { User } from "../models/user.models.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import uploadoncloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
const accessandrefreshtokenfunction=async(userid)=>{
try {
    const user=await User.findById(userid);
    const accessToken=user.generate_access_token();
    const refreshToken=user.generate_refesh_token();
    user.refreshToken=refreshToken;
    await user.save({ validateBeforeSave : false });
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
const refreshaccesstoken=asynchandlerfunction(async(req,res)=>{
   const incomingrefreshtoken= req.cookie.accessToken || req.body.refreshToken;
   if(!incomingrefreshtoken){
    throw new ApiError(404,"unathorized request");
   }
   try {
    const decodedrefreshtoken=jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET);
    const user=await User.findById(decodedrefreshtoken._id);
    if(!user){
     throw new ApiError(404,"unathorized request");
    }
    if(user.refreshToken===incomingrefreshtoken){
 throw new ApiError(404,"incoming and db refresh token does not match");
    }
    const {accessToken,refreshToken}=await accessandrefreshtokenfunction(user._id);
    const options = {
     httpOnly: true,
     secure: true,
   };
   return res.status(200)
   .cookie("accessToken",accessToken,option)
   .cookie("refreshToken",refreshToken,option)
   .json(new ApiResponse(200,{accessToken,refreshToken},"accesstoken successfully sent"));
   } catch (error) {
    throw new ApiError(404,error?.message || "invalid refreshtoken");
    
   }
})
const changethepassword=asynchandlerfunction(async(req,res)=>{
    const{oldpassword,newpassword}=req.body;
   const user=await User.findById(req.user._id);
   if(!user){
    throw new ApiError(404,"user is not found");

   }
const isPasswordCorrect=await user.isPasswordCorrect(oldpassword);
if(!isPasswordCorrect){
    throw new ApiError(403,"password is incorrect");
}
user.password=newpassword;
await user.save({validateBeforeSave : false })
})
const getcurrentuser=asynchandlerfunction(async(req,res)=>{
    return res.status(200)
    .json(new ApiResponse(200,req.user,"currenusersuccessfully sended"));
})
const updateaccountdetails=asynchandlerfunction(async(req,res)=>{
    const {fullname,email}=req.body;
    const user=User.findByIdAndUpdate(req.user._id,
        {
$set:{
    fullname,
    email
}
        },
        {
            new:true
        }
    ).select("-password")
    return res.status(200)
    .json (new ApiResponse(200,user,"account details successfully updated"))
})
const updateavatar=asynchandlerfunction(async(req,res)=>{
    const avatarlocalpath=req.file?.path;
    if(!avatarlocalpath){
        throw new ApiError(400,"avatar local path not found");
    }
    const avatar=await uploadoncloudinary(avatarlocalpath);
    if(!avatar.id){
        throw new ApiError(400,"avatar local path not found");
    }
    await User.findByIdAndUpdate(
        req.user?._id,
        {
           $set:{
            avatar:avatar.url
           } 
        },
        {
            new:true
        }
    ).select(
        "-password"
)
return res.status(200)
    .json(new ApiResponse(200,user,"cover image successfully updated"));
})
const updatecoverimage=asynchandlerfunction(async(req,res)=>{
    const coverimagelocalpath=req.file?.path;
    if(!coverimagelocalpath){
        throw new ApiError(402,"Cover image local path not found");
    }
    const coverimage=await uploadoncloudinary(coverimagelocalpath);
    if(!coverimage.url){
        throw new ApiError(402,"Cover image url not found");
    }
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverimage:coverimage.url
            }
        },
        {
            new:true
        }
    ).select("-password")
    return res.status(200)
    .json(new ApiResponse(200,user,"cover image successfully updated"));
})

export {
    registeruser,
    loginuser,
    logoutuser,
    refreshaccesstoken,
    changethepassword,
    getcurrentuser,
    updateaccountdetails,
    updateavatar,
    updatecoverimage
}