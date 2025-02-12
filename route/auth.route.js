import { Router } from "express";
import {
    registerUser,loginUser,getAllUser
} from "../controller/auth.controller.js";
import { get } from "mongoose";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/getusers").get(getAllUser);
// router.route("/login").post(loginUser);

// Secured routes
// router.route("/logout").post(verifyJWT, logoutUser);

// router.route("/refresh-token").get(refreshAccessToken);

// router.route("/changePassword").post(verifyJWT, changeCurrentPassword);

export default router;
