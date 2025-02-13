// models/content.model.js
import mongoose from "mongoose";
import { User } from "./user.models.js";
const { Schema, model } = mongoose;

const contentSchema = new Schema(
	{
		value: {
			type: Number,
			require: false,
		},
		subject: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		attachments: [
			{
				type: String, 
				required: false,
			},
		],
		to_userid: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		from_userid: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

export default model("Content", contentSchema);
