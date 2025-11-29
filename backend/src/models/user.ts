import mongoose, { Schema, Document } from 'mongoose';
import { Interface } from 'readline';

mongoose.connect("mongodb://localhost:27017/vaultpay");

export interface IUser extends Document{
    email: string;
    password: string;
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
        }
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
