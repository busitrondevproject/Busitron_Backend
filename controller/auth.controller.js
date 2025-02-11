import { User } from "../models/user.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandle.js";
import { errorHandler } from "../utils/errorHandle.js";

export const registerUser = asyncHandler(async (req, res) => {
    console.log("Register user");
    
    const { username, email, fullname, password } = req.body;

    if ([username, email, fullname, password].some((field) => field.trim() === "")) {
        throw new apiError(400, "All filed is required!!");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) throw new errorHandler(409, "This user already exists");

    const user = await User.create({
        fullname,
        email,
        password,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) throw new errorHandler(500, "Something went wrong while creating user");

    return res.status(200).json(new apiResponse(200, createdUser, "User created successfully"));
});
