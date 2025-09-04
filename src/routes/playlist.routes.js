import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
    createPlaylist, getUserPlaylists,
    getPlaylistById,
    addVideosToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
router.route("/creatplaylist").post(verifyJWT, createPlaylist);
router.route("/getuserplaylistbyuserid/:userId").get(verifyJWT, getUserPlaylists);
router.route("/getplaylistbyplaylistid/:playlistId").get(verifyJWT, getPlaylistById);
router.route("/addvideostoplaylist/:playlistId/videos/:videoIds").patch(verifyJWT, addVideosToPlaylist);
router.route("/removevideofromplaylist/:playlistId/videos/:videoIds").delete(verifyJWT, removeVideoFromPlaylist);
router.route("/deleteplaylistbyid/:playlistId").delete(verifyJWT, deletePlaylist);
router.route("/updateplaylistbyid/:playlistId").put(verifyJWT, updatePlaylist);
export default router; 