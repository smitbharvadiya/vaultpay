
import mongoose, { Schema, Document } from "mongoose";

export interface IPayments extends Document {
    userId: mongoose.Types.ObjectId,
    apiKeyId: mongoose.Types.ObjectId,
    provider: string,
    orderId: string,
    paymentId?: string,
    amount: number,
    currency: string,
    status: string
    raw: object,
}

const paymentSchema = new Schema<IPayments>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    apiKeyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ApiKey",
        required: true,
    },
    provider: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    paymentId: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: "INR",
    },
    status: {
        type: String,
        default: "created",
    },
    raw: { 
        type: Object 
    },
}, { timestamps: true });

export default mongoose.model<IPayments>("Payments", paymentSchema);
