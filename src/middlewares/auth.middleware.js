import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/Apierror.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized access");
    }

    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    
    req.user = user;
    next();

  } catch (error) {
    console.error("JWT verification failed:", error);
    throw new ApiError(401, "Unable to verify JWT");
  }
});

export default verifyJWT;
