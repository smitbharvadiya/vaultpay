import express from "express";
import crypto from "crypto";
import verifyToken from "../middleware/verifyToken";
import ApiKey from "../models/apiKey";
import userModel from "../models/user";

const router = express.Router();

router.post("/generate", verifyToken, async (req, res) => {
    try {

        const userId = req.userId;

        const user = await userModel.findById({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        };

        if (user.apiKeyCount >= user.apiKeyLimit) {
            return res.status(400).json({
                success: false,
                message: "API Key Limit Reached!"
            });
        };

        if(user.lastKeyGeneratedAt){
            const hoursPassed = ( Date.now() - user.lastKeyGeneratedAt.getTime() ) / (60 * 60 * 1000);
            if(hoursPassed < user.apiKeyCooldown){
                const remaining = (user.apiKeyCooldown - hoursPassed).toFixed(1);
                return res.status(400).json({
                success: false,
                message: `Cooldown active. Try again in ${remaining} hours`,
            });
            }
        };

        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ err: "Key name is required" })
        }

        const exists = await ApiKey.findOne({ userId, name });
        if (exists) {
            return res.status(400).json({ err: "API Key name already exists" });
        }

        const rawKey = crypto.randomBytes(32).toString("hex");

        const hashedKey = crypto.createHash("sha256").update(rawKey).digest("hex");

        await ApiKey.create({
            userId: req.userId,
            name,
            key: hashedKey,
        });

        user.apiKeyCount += 1;
        user.lastKeyGeneratedAt = new Date();
        await user.save();

        return res.status(201).json({
            success: true,
            apiKey: rawKey
        });

    } catch (err) {
        console.error("Error generating API key:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/list", verifyToken, async (req, res) => {

    try {
        const keys = await ApiKey.find({ userId: req.userId }).sort({ createdAt: -1 });

        const formatedKeys = keys.map((k) => ({
            id: k._id,
            name: k.name,
            keyMasked: k.key ? k.key.slice(0, 4) + "****" + k.key.slice(-4) : "",
            createdAt: k.createdAt,
        }));

        res.status(200).json({ apiKeys: formatedKeys });

    } catch (error) {
        console.error("Error fetching API keys:", error);
        res.status(500).json({ message: "Server error" });
    }

});

export default router;
