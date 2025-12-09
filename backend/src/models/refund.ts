
import mongoose, { Schema } from "mongoose";

export interface IRefunds extends Document {
    orderId: string,
    paymentId: string,
    refundId: string,
    provider: string,
    amount: number,
    status: string,
    currency: string,
    raw: any,
}

const refundSchema = new Schema<IRefunds>({
    paymentId: {
        type: String,
        required: true
    },
    refundId: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        required: true,
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
    },
    raw: {
        type: Object
    },
}, { timestamps: true });

export default mongoose.model("Refund", refundSchema);
