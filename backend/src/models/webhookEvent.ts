// models/webhookEvent.ts
import mongoose from "mongoose";

const webhookEventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true, 
  },
  provider: {
    type: String,
    enum: ["razorpay", "stripe"],
    required: true,
  },
  webhookId: {
    type: String,
    required: true,
  },
  receivedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("WebhookEvent", webhookEventSchema);
