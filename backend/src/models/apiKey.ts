
import mongoose, { Schema, Document} from "mongoose";

export interface IApiKey extends Document {
    userId: mongoose.Types.ObjectId,
    name: string;
    key: string;
    active: boolean;
    createdAt: Date;
}

const apiSchema = new Schema<IApiKey>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        key: {
            type: String,
            required: true,
            unique: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        active: {
            type: Boolean,
            default: true,
        }
    });

apiSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model<IApiKey>("ApiKey", apiSchema);