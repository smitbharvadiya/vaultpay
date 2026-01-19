
import mongoose, { Schema, Document} from "mongoose";

export interface IApiKey extends Document {
    userId: mongoose.Types.ObjectId,
    name: string;
    key: string;
    env: string;
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
            trim: true,
        },
        key: {
            type: String,
            required: true,
            unique: true,
        },
        env: {
            type: String,
            enum: ["test"],
            default: "test",
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