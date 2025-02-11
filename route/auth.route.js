import { Router } from "express";
import {
    registerUser,
} from "../controller/auth.controller.js";

const router = Router();

router.route("/register").post(registerUser);

// router.route("/login").post(loginUser);

// Secured routes
// router.route("/logout").post(verifyJWT, logoutUser);

// router.route("/refresh-token").get(refreshAccessToken);

// router.route("/changePassword").post(verifyJWT, changeCurrentPassword);

export default router;
