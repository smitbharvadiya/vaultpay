
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import userModel from './models/user';
import apiKeyRoutes from './routes/apiKeyRoute';
import paymentRoutes from './routes/paymentRoutes';
import webhookRoute from './routes/webhookRoute';
import analyticsRoute from './routes/analyticsRoute';
import gatewayAuthRoute from './routes/gatewayAuthRoute';
import paymentModel from './models/paymentModel';
import verifyToken from './middleware/verifyToken';

const app = express();

app.use(cors({
    origin: [
        "https://vaultpay-one.vercel.app",
        "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.use("/webhook/stripe", express.raw({ type: "*/*" }));


app.use(express.json());
app.use(cookieParser());

app.use("/webhook", webhookRoute);
app.use("/api/keys", apiKeyRoutes);
app.use("/payment", paymentRoutes);
app.use("/analytics", analyticsRoute);
app.use("/gateways", gatewayAuthRoute);

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
                    process.env.JWT_SECRET!,
                    { expiresIn: '1h' }
                );
                console.log("JWT Token: ", token);

                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 60 * 60 * 1000,
                });


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
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 60 * 60 * 1000,
        });


        return res.status(200).json({ message: "Login successful" });

    } catch (err) {
        console.log("Login Error: ", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/logout", (req, res) => {
    
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });

    res.json({ message: "Logout Succesfull" });
});

app.get("/checkAuth", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ isAuthenticated: false });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        res.json({ isAuthenticated: true, user: decoded });
    } catch (err) {
        res.json({ isAuthenticated: false });
    }

});

app.get("/payments", verifyToken, async (req, res) => {
    try {

        const apiKeyId = req.query.apiKeyId as string;

        const query: any = {
            userId: req.userId, 
        };

        // optional filter
        if (apiKeyId) {
            query.apiKeyId = apiKeyId;
        }

        const payments = await paymentModel
            .find(query)
            .sort({ createdAt: -1 });

        return res.status(200).json({ payments });
    } catch (err: any) {
        console.error("Fetch payments error:", err);
        return res.status(500).json({
            message: "Failed to fetch payments",
        });
    }
});

export default app;