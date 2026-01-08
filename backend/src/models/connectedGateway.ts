import mongoose, { Schema, Document} from "mongoose";

interface EncryptedCredentials {
  iv: string;
  content: string;
  authTag: string;
}

const encryptedFieldSchema = new mongoose.Schema(
  {
    iv: { type: String, required: true },
    content: { type: String, required: true },
    authTag: { type: String, required: true },
  },
  { _id: false }
);

export interface IConnectedGateway {
  userId: mongoose.Types.ObjectId;
  provider: "razorpay" | "stripe" | "paypal";
  type: "api_key" | "oauth";
  credentials: EncryptedCredentials;
  status: "CONNECTED" | "DISCONNECTED";
  is_active: boolean;
}


const connectedGatewaySchema = new Schema<IConnectedGateway>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    provider: {
      type: String,
      enum: ["razorpay", "stripe", "paypal"],
      required: true,
    },
    type: {
      type: String,
      enum: ["api_key", "oauth"],
      required: true,
    },
    credentials: {
      type: encryptedFieldSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ["CONNECTED", "DISCONNECTED"],
      default: "CONNECTED",
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


export default mongoose.model(
  "ConnectedGateway",
  connectedGatewaySchema
);

