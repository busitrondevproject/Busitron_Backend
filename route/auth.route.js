import express from "express";
import {
	changePassword,
	forgotPassword,
	loginUser,
	otpVerification,
	passwordInvitation,
	profileUpdate,
	registerUser,
	resendOtp,
} from "../controller/auth.controller.js";
import authenticateUser from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/otp", authenticateUser, otpVerification);

router.post("/re-sendOtp", authenticateUser, resendOtp);

router.put("/profileUpdate", authenticateUser, profileUpdate);

router.put("/changePassword", authenticateUser, changePassword);

router.post("/forgot_invitation", authenticateUser, passwordInvitation);

router.post("/forgot_password", authenticateUser, forgotPassword);

router.get("/profile", authenticateUser, (req, res) => {
	res.status(200).json({
		message: "This is a protected route",
		user: req.user,
	});
});

export default router;
