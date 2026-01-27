import mongoose from "mongoose";

const webhookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: ["razorpay", "stripe"],
      required: true,
    },
    webhookUrl: {
      type: String,
      required: true,
    },
    secret: {
      type: String,
      required: true,
    },
    lastEventAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Webhook", webhookSchema);
