import mongoose from "mongoose";

const { Schema } = mongoose;

const emailSchema = new Schema(
  {
    value: {
      type: Number,
      default: 0,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
    },
    content: {
      type: String,
      required: true,
    },
    attachments: [
      {
        type: String,
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

export default mongoose.model("Email", emailSchema);
