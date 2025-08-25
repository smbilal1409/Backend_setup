import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/Apierror.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
export const verifyJWT=asyncHandler(async(req,res,next)=>{
try {
    const token=req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","");
    if(!token){
    throw new ApiError(401,"unathorized access");
    
    }
    const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    const user=User.findById(decodedtoken?._id).select("-password -refreshtoken");
    if(!user){
        throw new ApiError(401,"invalid access token");
    }
    req.user=user;
    next()
    }
catch (error) {
    throw new ApiError(400,error,"unable to verify jwt");
}
})
export default verifyJWT;