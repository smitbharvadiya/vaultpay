import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import userModel from '../models/user.js';
import apiKeyRoutes from '../routes/apiKeyRoute.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    secure: false, // true in production (HTTPS)
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Vault API is running...');
});

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already exists. Please log in." });
    }

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async (err, hash) => {
            try {
                const createdUser = await userModel.create({
                    email: email,
                    password: hash
                });

                const token = jwt.sign(
                    { id: createdUser._id, email: createdUser.email },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                res.cookie("token", token);

                res.status(201).json({
                    message: 'User Created Succesfully',
                    user: createdUser,
                    token: token
                });

            } catch (err) {
                console.log(err);
                res.status(500).json({ message: 'Error Creating User', err });
            }
        });
    });

});

app.post("/login", async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) return res.status(400).json({ message: "User Not Found!" });

        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password!" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.cookie("token", token);

        return res.status(200).json({ message: "Login successful" });

    } catch (err) {
        console.log("Login Error: ", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout Succesfull" });
});

app.use('/api/payments', (req, res) => {
    res.json({ message: 'Payments route works!' });
});

app.use("/api/keys", apiKeyRoutes);

export default app;