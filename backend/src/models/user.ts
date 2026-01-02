import mongoose, { Schema, Document } from 'mongoose';
import { Interface } from 'readline';

mongoose.connect("mongodb://localhost:27017/vaultpay");

export interface IUser extends Document{
    email: string;
    password: string;
    tier: string;
    apiKeyLimit: number;
    apiKeyCooldown: number;
    apiKeyCount: number;
    lastKeyGeneratedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        tier: {
            type: String,
            enum: ["FREE", "PRO", "ENTERPRISE"],
            default: "FREE",
        },
        apiKeyLimit: {
            type: Number,
            default: 3,
        },
        apiKeyCooldown: {
            type: Number,
            default: 5, //86400
        },
        apiKeyCount: {
            type: Number,
            default: 0,
        },
        lastKeyGeneratedAt: { 
            type: Date, 
            default: null 
        },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
