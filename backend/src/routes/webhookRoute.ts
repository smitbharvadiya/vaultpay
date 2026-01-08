import express from 'express';
import { RazorpayWebhookAdapter } from '../adapters/RazorpayWebhookAdapter';

const router = express.Router();

router.post("/:provider", express.raw({ type: "*/*" }), async (req: any, res: any) => {

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