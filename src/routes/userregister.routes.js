import { Router } from "express";
import registeruser from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router=Router();
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1

        },
        {
            name:"coverimage",
            maxCount:1

        }

    ]),(req, res, next) => {
        
        next(); 
      },
registeruser);

export default router;