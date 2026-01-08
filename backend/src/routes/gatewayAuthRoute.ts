import express from "express";
import verifyToken from "../middleware/verifyToken";
import { encrypt } from "../utils/encryption";
import ConnectedGateway from "../models/connectedGateway";
import connectedGateway from "../models/connectedGateway";

const router = express.Router();

router.post("/razorpay/connect", verifyToken, async (req, res) => {

    try {
        const { keyId, keySecret } = req.body;

        if (!keyId || !keySecret) {
            return res.status(400).json({ message: "Missing Razorpay credentials" });
        }

        const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");

        const razorpayRes = await fetch(
            "https://api.razorpay.com/v1/orders?count=1",
            {
                method: "GET",
                headers: {
                    Authorization: authHeader,
                },
            }
        );

        if (!razorpayRes.ok) {
            return res.status(401).json({
                message: "Invalid Razorpay credentials",
            });
        }

        const encryptedCredentials = encrypt({ keyId, keySecret });

        const existing = await ConnectedGateway.findOne({
            userId: req.userId,
            provider: "razorpay",
        });

        if (existing) {
            return res.status(409).json({
                message: "Razorpay already connected",
            });
        }

        await ConnectedGateway.create({
            userId: req.userId,
            provider: "razorpay",
            type: "api_key",
            credentials: encryptedCredentials,
        });

        return res.status(200).json({
            message: "Razorpay connected successfully",
        });

    } catch (err) {
        return res.status(500).json("Razorpay Connection Failed");
    }

});

router.get("/razorpay/status", verifyToken, async (req, res) => {

    try {
        const gateway = await connectedGateway.findOne({
            userId: req.userId,
            provider: "razorpay",
            status: "CONNECTED",
            is_active: true
        });

        return res.status(200).json({
            connected: Boolean(gateway),
        });
        
    } catch (err) {
        console.error("Gateway status error:", err);
        return res.status(500).json({
            connected: false,
            error: "Failed to check gateway status",
        });
    }
});

export default router;