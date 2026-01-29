import mongoose from "mongoose";

const webhookSchema = new mongoose.Schema(
  {
    webhookId: {
      type: String,
      unique: true,
      required: true,
    },
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
    secret: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
    lastEventAt: {
      type: Date,
    },
  },
  { timestamps: true }
);  

webhookSchema.index(
  { userId: 1, provider: 1 },
  { unique: true }
);


export default mongoose.model("Webhook", webhookSchema);
