import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: false,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		phoneNumber: {
			type: String,
			required: false,
		},
		avatar: {
			type: String,
			required: false,
			defaultAvatar: "",
		},
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		role: {
			type: String,
			enum: ["Admin", "Employee"],
			required: true,
			default: "Employee",
		},
		refreshToken: {
			type: String,
			default: null,
		},
		accessToken: {
			type: String,
			default: null,
		},
		otp: {
			type: String,
			default: null,
			expiredAt: Date.now() + 10 * 60,
		},
		isValid: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.password = await bcryptjs.hash(this.password, 10);
	next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
	return await bcryptjs.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			username: this.username,
			fullname: this.fullname,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		}
	);
};
userSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
		}
	);
};

export const User = mongoose.model("User", userSchema);
