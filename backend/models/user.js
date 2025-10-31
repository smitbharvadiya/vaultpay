import mongoose from 'mongoose';

mongoose.connect(`mongodb://localhost:27017/vaultpay`);

const userSchema = mongoose.Schema({
    email: String,
    password: String
});

export default mongoose.model("user", userSchema);