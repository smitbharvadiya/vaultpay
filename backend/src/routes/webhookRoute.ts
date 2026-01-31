import express from 'express';
import { RazorpayWebhookAdapter } from '../adapters/RazorpayWebhookAdapter';
import verifyToken from '../middleware/verifyToken';
import crypto from 'crypto';
import webhookConfig from '../models/webhookConfig';
import webhookEvent from '../models/webhookEvent';
import { nanoid } from 'nanoid';
import { StripeWebhookAdapter } from '../adapters/stripeWebhookAdaptor';

const router = express.Router();

router.post("/secret/generate", verifyToken, async (req, res) => {

  try {
    const userId = req.userId;

    const { provider } = req.body;

    if (!provider) {
      return res.status(400).json({ message: "Provider is required" });
    }

    const webhookId = "wh_" + nanoid(21);

    let secret = null;

<<<<<<< Updated upstream
=======
    if (provider === "razorpay") {
      secret = crypto.randomBytes(32).toString("hex");
    }

>>>>>>> Stashed changes
    const webhook = await webhookConfig.findOneAndUpdate(
      { userId, provider },
      {
        webhookId,
<<<<<<< Updated upstream
        secret: webhookSecret,
=======
        secret,
>>>>>>> Stashed changes
        provider,
        userId,
        status: "active",
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      webhookUrl: `https://vaultpay-4ez5.onrender.com/webhook/${provider}/${webhookId}`,
<<<<<<< Updated upstream
      secret: webhook.secret,
=======
      ...(secret && { secret })
>>>>>>> Stashed changes
    });


  } catch (err) {
    console.error("Webhook generation error:", err);
    res.status(500).json({ message: "Failed to generate webhook secret" });
  }

});

<<<<<<< Updated upstream
=======
router.post("/stripe/save-secret", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { secret } = req.body;

    if (!secret) return res.status(400).json({ message: "Stripe secret is required" });

    const provider = "stripe";

    const webhook = await webhookConfig.findOne({ userId, provider });

    if (!webhook || !webhook.webhookId) {
      return res.status(400).json({
        message: "Generate webhook URL first",
      });
    }

    webhook.secret = secret;
    webhook.status = "active";
    await webhook.save();

    res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to save Stripe secret" });
  }
});

>>>>>>> Stashed changes
router.get("/status/:gateway", verifyToken, async (req, res) => {

  const { gateway } = req.params;

  try {
    const gatewayWebhook = await webhookConfig.findOne({
      userId: req.userId,
      provider: gateway,
      status: "active",
    });

    return res.status(200).json({
      connected: Boolean(gatewayWebhook),
    });

  } catch (err) {
    return res.status(500).json({
      connected: false,
      error: "Failed to check webhook status",
    });
  }
});

router.post("/razorpay/:webhookId", express.raw({ type: "*/*" }), async (req: any, res: any) => {

  try {
    const { webhookId } = req.params;

    const webhook = await webhookConfig.findOne({ webhookId, status: "active" });

    if (!webhook) {
      return res.status(404).send("Webhook not found");
    }

    const adapter = new RazorpayWebhookAdapter();

    const event = adapter.verifyWebhook(req, webhook.secret);

    try {
      await webhookEvent.create({
        eventId: event.id,
        provider: "razorpay",
        webhookId,
      });
    } catch (err: any) {
      if (err.code === 11000) {
        return res.status(200).json({ ignored: true });
      }
      throw err;
    }

    await adapter.normalizeWebhook(event);

    return res.status(200).json({ success: "Signature verified succesfully" });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return res.status(400).json({ error: "Invalid signature" });
  }

});

router.post("/stripe/:webhookId", express.raw({ type: "*/*" }), async (req: any, res: any) => {

  try {
    const { webhookId } = req.params;

    const webhook = await webhookConfig.findOne({ webhookId, status: "active" });

    if (!webhook) {
      return res.status(404).send("Webhook not found");
    }

    const adapter = new StripeWebhookAdapter();

    const event = adapter.verifyWebhook(req, webhook.secret);

    try {
      await webhookEvent.create({
        eventId: event.id,
        provider: "stripe",
        webhookId,
      });
    } catch (err: any) {
      if (err.code === 11000) {
        return res.status(200).json({ ignored: true });
      }
      throw err;
    }

    // await adapter.normalizeWebhook(event);

    return res.status(200).json({ success: "Signature verified succesfully" });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return res.status(400).json({ error: "Invalid signature" });
  }

});

export default router;