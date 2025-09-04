import { Router } from "express";
import { registeruser, loginuser, logoutuser, refreshaccesstoken, 
    changethepassword, getcurrentuser, updateaccountdetails, 
    updatecoverimage, updateavatar, getthechannelprofile, 
    getwatchhistory} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1

        },
        {
            name: "coverimage",
            maxCount: 1

        }

    ]), (req, res, next) => {

        next();
    },
    registeruser);
router.route("/login").post(loginuser);
router.route("/logout").post(verifyJWT, logoutuser);
router.route("/refresh_token").post(refreshaccesstoken);
router.route("/changepassword").post(verifyJWT, changethepassword);
router.route("/currentuser").get(verifyJWT, getcurrentuser);
router.route("/updateaccountdetails").post(verifyJWT, updateaccountdetails);
router.route('/update-avatar').patch(upload.single('avatar'), verifyJWT, updateavatar);
router.route('/update-cover-image').patch(verifyJWT, upload.single('coverimage'), updatecoverimage);
router.route('/getthechannelprofile/:username').get(verifyJWT, getthechannelprofile);
router.route('/getthewatchhistory').get(verifyJWT, getwatchhistory);

export default router;  