import { User } from "../models/user.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandle.js";
import { errorHandler } from "../utils/errorHandle.js";

import sendEmailUserDetails from "../helper/sendEmailUserDetails.helper.js";
import sendEmailOtp from "../helper/sendEmailOtp.helper.js";

import generateRandomPassword from "../helper/generateRandomPassword.helper.js";
import generateOtp from "../helper/generateOtp.helper.js";

export const registerUser = asyncHandler(async (req, res) => {
	const { email } = req.body;
	const password = generateRandomPassword();
	console.log(password);

	if (!email)
		throw new errorHandler(400, "Email and full name are required!");

	const existedUser = await User.findOne({ email });

	if (existedUser) throw new errorHandler(409, "User already exists");

	const user = await User.create({
		email,
		password,
	});

	const result = await sendEmailUserDetails(email, password, res);

	if (result.success) {
		return res.status(201).json(
			new apiResponse(
				201,
				{
					id: user._id,
					email: user.email,
				},
				"User registered successfully."
			)
		);
	}
});

export const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password)
		throw new errorHandler(400, "Email and password are required!");

	const user = await User.findOne({ email });

	if (!user) throw new errorHandler(401, "Invalid email or password");

	const isPasswordValid = await user.isPasswordCorrect(password);

	if (!isPasswordValid)
		throw new errorHandler(401, "Invalid email or password");

	const accessToken = user.generateAccessToken();
	const refreshToken = user.generateRefreshToken();

	user.accessToken = accessToken;
	user.refreshToken = refreshToken;

	await user.save();

	res.cookie("accessToken", accessToken);
	res.cookie("refreshToken", refreshToken);

	if (!user.isValid) {
		const otp = generateOtp();

		const response = await sendEmailOtp(email, otp, res);

		if (response.success) {
			user.otp = otp;
			await user.save();
		}
	}

	return res.status(200).json(
		new apiResponse(
			200,
			{
				id: user._id,
				email: user.email,
			},
			"Login successful!"
		)
	);
});

export const otpVerification = asyncHandler(async (req, res) => {
	try {
		const { otp } = req.body;
		const user = await User.findById(req.user._id);
		if (!user)
			return res
				.status(404)
				.json(new apiResponse(404, null, "User not found"));
		const getOtp = user.otp;
		if (otp === getOtp) {
			user.isValid = true;
			await user.save();
			return res
				.status(200)
				.json(new apiResponse(200, null, "OTP verified successfully"));
		} else {
			return res
				.status(400)
				.json(new apiResponse(400, null, "Invalid OTP"));
		}
	} catch (err) {
		return res
			.status(500)
			.json(new errorHandler(500, null, "Something went wrong"));
	}
});

export const profileUpdate = asyncHandler(async (req, res) => {
	const { phoneNumber, fullName, avatar } = req.body;

	try {
		const user = await User.findByIdAndUpdate(
			req.user._id,
			{
				phoneNumber,
				name: fullName,
				avatar,
			},
			{ new: true }
		);

		res.status(201).json(new apiResponse(201, null, user));
	} catch (err) {
		res.status(500).json(new apiResponse(500, null, err.message));
	}
});

export const changePassword = asyncHandler(async (req, res) => {
	try {
		const { newPassword, conformPassword, previousPassword } = req.body;
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user)
			return res
				.status(404)
				.json(new apiResponse(404, null, "User not found"));
		const checkPassword = await user.isPasswordCorrect(previousPassword);

		if (!checkPassword)
			return res
				.status(400)
				.json(new apiResponse(400, null, "Invalid Password"));
		if (newPassword !== conformPassword)
			return res
				.status(400)
				.json(new apiResponse(400, null, "Password does not match"));
		user.password = newPassword;
		await user.save();
		return res
			.status(200)
			.json(new apiResponse(200, null, "Password updated successfully"));
	} catch (err) {
		return res
			.status(500)
			.json(new errorHandler(500, null, "Something went wrong"));
	}
});
