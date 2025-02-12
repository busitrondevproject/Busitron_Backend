import { User } from "../models/user.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandle.js";
import { errorHandler } from "../utils/errorHandle.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
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




export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUser = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password -refreshToken");
  
   
    if (!users || users.length === 0) {
      throw new errorHandler(404, "No users found");
    }
  
    return res
      .status(200)
      .json(new apiResponse(200, users, "Users fetched successfully"));
  });
  
