// import { Router } from "express";
// import {
//     registerUser,
// } from "../controller/auth.controller.js";

// const router = Router();

// router.route("/register").post(registerUser);

// // router.route("/login").post(loginUser);

// // Secured routes
// // router.route("/logout").post(verifyJWT, logoutUser);

// // router.route("/refresh-token").get(refreshAccessToken);

// // router.route("/changePassword").post(verifyJWT, changeCurrentPassword);

// export default router;


import express from "express";
import { changePassword, loginUser, otpVerification, profileUpdate, registerUser } from "../controller/auth.controller.js";
import authenticateUser from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login",loginUser)

router.post('/otp',authenticateUser,otpVerification)

router.put('/profileupdate',authenticateUser,profileUpdate)

router.put('/changePassword',authenticateUser,changePassword)

// Protected Route Example
router.get("/profile",
    authenticateUser,
     (req, res) => {
    res.status(200).json({ message: "This is a protected route", user: req.user });
});

export default router;
