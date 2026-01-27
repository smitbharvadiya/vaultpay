import express from 'express';
import { RazorpayWebhookAdapter } from '../adapters/RazorpayWebhookAdapter';
import verifyToken from '../middleware/verifyToken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import webhookConfig from '../models/webhookConfig';

const router = express.Router();

router.post("/secret/generate", verifyToken, async (req, res) => {

  try {
    const userId = req.userId;

    const secret = crypto.randomBytes(32).toString("hex");

    const webhookUrl = "https://vaultpay-4ez5.onrender.com/webhook/razorpay";

    const hashedSecret = await bcrypt.hash(secret, 10);

    const webhook = await webhookConfig.findOneAndUpdate(
      { userId, provider: "razorpay" },
      {
        secret: hashedSecret,
        webhookUrl,
        provider: "razorpay",
        userId,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      webhookUrl: webhook.webhookUrl,
      secret: webhook.secret,
    });


  } catch (err) {
    console.error("Webhook generation error:", err);
    res.status(500).json({ message: "Failed to generate webhook secret" });
  }

})

router.post("/razorpay", express.raw({ type: "*/*" }), async (req: any, res: any) => {

  try {
    const adapter = new RazorpayWebhookAdapter();

    const event = adapter.verifyWebhook(req);
    await adapter.normalizeWebhook(event);

    return res.status(200).json({ success: "Signature verified succesfully" });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return res.status(400).json({ error: "Invalid signature" });
  }

})

export default router;