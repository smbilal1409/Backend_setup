import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getChannelVideos,getChannelStats } from "../controllers/dashboard.controller.js";
const router = Router();
router.route("/getChannelvideos").get(verifyJWT,getChannelVideos);
router.route("/getChannelstates").get(verifyJWT,getChannelStats);
export default router;