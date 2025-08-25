import { Router } from "express";
import {registeruser,loginuser,logoutuser,refreshaccesstoken,changethepassword,getcurrentuser,updateaccountdetails,updatecoverimage,updateavatar} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
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
router.route("/login").post(loginuser);
router.route("/logout").post(verifyJWT,logoutuser);
router.route("/refresh_token").post(refreshaccesstoken);
router.route("/changepassword").post(verifyJWT,changethepassword);
router.route("/currentuser").post(verifyJWT,getcurrentuser);
router.route("/updateaccountdetails").post(verifyJWT,updateaccountdetails);
router.route('/update-avatar').post(verifyJWT, upload.single('avatar'), updateavatar);
router.route('/update-cover-image').post(verifyJWT, upload.single('coverImage'), updatecoverimage);
export default router;