import express from 'express';
import { RazorpayWebhookAdapter } from '../adapters/RazorpayWebhookAdapter';
import verifyToken from '../middleware/verifyToken';
import crypto from 'crypto';
import webhookConfig from '../models/webhookConfig';
import { encrypt } from '../utils/encryption';
import { nanoid } from 'nanoid';

const router = express.Router();

router.post("/secret/generate", verifyToken, async (req, res) => {

  try {
    const userId = req.userId;

    const webhookId = "wh_" + nanoid(21);

    const webhookSecret = crypto.randomBytes(32).toString("hex");

    const webhook = await webhookConfig.findOneAndUpdate(
      { webhookId, userId },
      {
        webhookId,
        secret: webhookSecret,
        provider: "razorpay",
        userId,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      webhookUrl: `${process.env.VITE_API_BASE_URL}/webhooks/razorpay/${webhookId}`,
      secret: webhook.secret,
    });


  } catch (err) {
    console.error("Webhook generation error:", err);
    res.status(500).json({ message: "Failed to generate webhook secret" });
  }

})

router.post("/razorpay/:webhookId", express.raw({ type: "*/*" }), async (req: any, res: any) => {

  try {
    const { webhookId } = req.params;

    const webhook = await webhookConfig.findOne({ webhookId, status: "active" });

    if (!webhook) {
      return res.status(404).send("Webhook not found");
    }
    
    const adapter = new RazorpayWebhookAdapter();

    const event = adapter.verifyWebhook(req, webhook.secret);
    await adapter.normalizeWebhook(event);

    return res.status(200).json({ success: "Signature verified succesfully" });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return res.status(400).json({ error: "Invalid signature" });
  }

})

export default router;