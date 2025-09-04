import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.models.js";
import { upload } from "../middlewares/multer.middleware.js";
import { togglesubscription,getUserChannelSubscribers ,getSubscribedChannels} from "../controllers/subscription.controller.js";
import { get } from "mongoose";
const router = Router();
router.route("/togglesubscription/:channelid").post(verifyJWT,togglesubscription)
router.route("/getuserchennelsubscribers/:channelid").get(verifyJWT,getUserChannelSubscribers)
router.route("/getsubscribedchannel/:channelid").get(verifyJWT,getSubscribedChannels)
export default router;