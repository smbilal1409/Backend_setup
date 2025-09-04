import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { addcomment,updatecomment,deletecomment} from "../controllers/comment.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
router.route("/addcomment/:videoid").post(verifyJWT,addcomment);
router.route("/updatecomment/:commentid").put(verifyJWT,updatecomment);
router.route("/deletecomment/:commentid").delete(verifyJWT,deletecomment);
export default router;  