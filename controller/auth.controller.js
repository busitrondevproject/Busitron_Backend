import { User } from "../models/user.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandle.js";
import { errorHandler } from "../utils/errorHandle.js";

import sendEmailUserDetails from "../helper/sendEmailUserDetails.helper.js";
import sendEmailOtp from "../helper/sendEmailOtp.helper.js";

import generateRandomPassword from "../helper/generateRandomPassword.helper.js";
import generateOtp from "../helper/generateOtp.helper.js";

export const registerUser = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        const password = generateRandomPassword();

        if (!email || !password) throw new errorHandler(400, "email or password missing");

        if (!email) throw new errorHandler(400, "Email and full name are required!");

        const existedUser = await User.findOne({ email });

        if (existedUser) throw new errorHandler(409, "User already exists");

        const user = await User.create({
            email,
            password,
        });

        const result = await sendEmailUserDetails(email, password, res);

        if (result.success) {
            res.status(201).json(
                new apiResponse(201, { id: user._id, email: email }, "register successfully")
            );
        } else {
            throw errorHandler(400, "some thing went wrong");
        }
    } catch (err) {
        throw new errorHandler(500, err.message);
    }
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) throw new errorHandler(400, "Email and password are required!");

    const user = await User.findOne({ email });

    if (!user) throw new errorHandler(401, "Invalid email or password");

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) throw new errorHandler(401, "Invalid email or password");

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

    return res
        .status(200)
        .json(new apiResponse(200, { id: user._id, email: email }, "Login successful"));
});

export const otpVerification = asyncHandler(async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) throw new errorHandler(404, "User not found");

        const getOtp = user.otp;
        if (otp === getOtp) {
            user.isValid = true;
            await user.save();

            return res.status(201).json(new apiResponse(201, null, "otp verified successfully"));
        } else {
            throw new errorHandler(400, "otp is invalid");
        }
    } catch (err) {
        throw new errorHandler(500, err.message);
    }
});

export const profileUpdate = asyncHandler(async (req, res) => {
    const { phoneNumber, fullName, avatar } = req.body;

    if (!phoneNumber || !fullName || !avatar) {
        throw new errorHandler(400, "all fields are required");
    }

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

        return res.status(201).json(new apiResponse(201, user, "profile updated successfully"));
    } catch (err) {
        throw new errorHandler(400, err.message);
    }
});

export const changePassword = asyncHandler(async (req, res) => {
    try {
        const { newPassword, conformPassword, previousPassword } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) throw new errorHandler(404, "user not found");
        const checkPassword = await user.isPasswordCorrect(previousPassword);

        if (!checkPassword) {
            throw new errorHandler(400, "password is wrong");
        }
        if (newPassword !== conformPassword) {
            throw new errorHandler(400, "password not valid");
        }
        user.password = newPassword;
        await user.save();
        return res.status(201).json(new apiResponse(201, null, "password updated successfully"));
    } catch (err) {
        throw new errorHandler(500, err.message);
    }
});

export const resendOtp = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) throw new errorHandler(404, "user not found");
        const otp = generateOtp();
        const response = await sendEmailOtp(user.email, otp, res);
        if (!response.success) throw new errorHandler(400, "otp not send successfully");
        user.otp = otp;
        await user.save();
        res.status(201).json(new apiResponse(201, null, "otp send successfully"));
    } catch (err) {
        throw new errorHandler(500, err.message);
    }
});
