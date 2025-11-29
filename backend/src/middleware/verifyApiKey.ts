import { Request, Response, NextFunction } from "express";
import crypto from 'crypto';
import ApiKey from "../models/apiKey";

const verifyApiKey = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(500).json({
                success: false,
                message: "Missing API Key",
            });
        }

        const rawKey = authHeader.split(" ")[1];

        const hashedKey = crypto.createHash("sha256").update(rawKey).digest("hex");

        const apiKey = await ApiKey.findOne({ key: hashedKey });

        if (!apiKey) {
            return res.status(401).json({
                success: false,
                message: "Invalid API key",
            });
        }

        req.userId = apiKey.userId.toString();

        next();

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }

}

export default verifyApiKey;