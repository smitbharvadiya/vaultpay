import express from "express";
import verifyToken from "../middleware/verifyToken";
import { encrypt } from "../utils/encryption";
import ConnectedGateway from "../models/connectedGateway";
import Stripe from "stripe";

const router = express.Router();

router.post("/razorpay/connect", verifyToken, async (req, res) => {

    try {
        const { keyId, keySecret } = req.body;

        if (!keyId || !keySecret) {
            return res.status(400).json({ message: "Missing Razorpay credentials" });
        }

        if (keyId.startsWith("rzp_live_")) {
            return res.status(400).json({
                message: "Live Razorpay keys are not allowed. VaultPay supports TEST mode only."
            });
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

        const existing = await ConnectedGateway.findOne({
            userId: req.userId,
            provider: "razorpay",
            env: "test",
        });

        if (existing) {
            return res.status(409).json({
                message: "Razorpay already connected",
            });
        }

        const encryptedCredentials = encrypt({ keyId, keySecret });

        await ConnectedGateway.create({
            userId: req.userId,
            provider: "razorpay",
            env: "test",
            type: "api_key",
            credentials: encryptedCredentials,
            status: "CONNECTED",
            is_active: true
        });

        return res.status(200).json({
            message: "Razorpay connected successfully",
        });

    } catch (err) {
        return res.status(500).json("Razorpay Connection Failed");
    }

});

router.post("/stripe/connect", verifyToken, async (req, res) => {

    try {
        const { secretKey } = req.body;

        if (!secretKey) {
            return res.status(400).json({ message: "Missing Stripe credentials" });
        }

        if (secretKey.startsWith("sk_live_")) {
            return res.status(400).json({
                message: "Live Stripe keys are not allowed. VaultPay supports TEST mode only."
            });
        }

        const stripeRes = await fetch("https://api.stripe.com/v1/balance", {
            headers: {
                Authorization: `Bearer ${secretKey}`,
            },
        });

        if (!stripeRes.ok) {
            return res.status(401).json({
                message: "Invalid Stripe credentials",
            });
        }

        const existing = await ConnectedGateway.findOne({
            userId: req.userId,
            provider: "stripe",
            env: "test",
        });

        if (existing) {
            return res.status(409).json({
                message: "Stripe already connected",
            });
        }

        const encryptedCredentials = encrypt({ secretKey });

        await ConnectedGateway.create({
            userId: req.userId,
            provider: "stripe",
            env: "test",
            type: "api_key",
            credentials: encryptedCredentials,
        });

        return res.status(200).json({
            message: "Stripe connected successfully",
        });

    } catch (err) {
        return res.status(500).json("Stripe Connection Failed");
    }

});

router.get("/status/:gateway", verifyToken, async (req, res) => {

    const { gateway } = req.params;

    try {
        const isGatewayConnected = await ConnectedGateway.findOne({
            userId: req.userId,
            provider: gateway,
            env: "test",
            status: "CONNECTED",
            is_active: true
        });

        return res.status(200).json({
            connected: Boolean(isGatewayConnected),
        });

    } catch (err) {
        console.error("Gateway status error:", err);
        return res.status(500).json({
            connected: false,
            error: "Failed to check gateway status",
        });
    }
});

router.delete("/razorpay", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;

        const deleted = await ConnectedGateway.findOneAndDelete({ userId, provider: 'razorpay' });

        if (!deleted) return res.status(404).json({ message: "Gateway not found" });

        res.status(200).json({ message: "Gateway connection wiped successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})

export default router;