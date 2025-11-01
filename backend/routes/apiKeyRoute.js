import express from "express";
import crypto from "crypto";
import verifyToken from "../middleware/verifyToken.js";
import apiKeyModel from "../models/apiKey.js";

const router = express.Router();

router.post("/generate", verifyToken, async (req, res) => {
    try{
        const newKey = crypto.randomBytes(32).toString("hex");

        await apiKeyModel.create({
            userId: req.userId,
            key: newKey,
        });

         res.status(201).json({ apiKey: newKey });

    }catch(err){
        console.error("Error generating API key:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
