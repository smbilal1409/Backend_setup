import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
const app=express();
app.use(cors({
origin:process.env.CORS_ORIGIN,
credentials:true
}))
app.use(express.json({
    limit:"16kb"
}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(express.static("Public"));
app.use(cookieParser());
import routerhandler from "./routes/user.routes.js";
app.use("/api/v1/user",routerhandler);
import tweetrouterhandler from "./routes/Tweet.routes.js";
app.use("/api/v1/tweet",tweetrouterhandler);
import videorouterhandler from "./routes/video.routes.js";
app.use("/api/v1/video",videorouterhandler);
import commentrouterhandler from "./routes/comments.routes.js";
app.use("/api/v1/comment",commentrouterhandler);
import subscriptionrouterhandler from "./routes/subscription.routes.js";
app.use("/api/v1/subscription",subscriptionrouterhandler);
import playlistrouterhandler from "./routes/playlist.routes.js";
app.use("/api/v1/playlist",playlistrouterhandler);
import healthcarerouterhandler from "./routes/healthcare.routes.js";
app.use("/api/v1/healthcare",healthcarerouterhandler);
import likesrouterhandler from "./routes/likes.routes.js";
app.use("/api/v1/like",likesrouterhandler);
import dashboardrouterhandler from "./routes/dashboard.routes.js";
app.use("/api/v1/dashboard",dashboardrouterhandler);
export {app};