

import express from 'express';
import { providerRegistry } from '../adapters/providerRegistry';

const router = express.Router();

router.post("/:provider",  express.raw({ type: "*/*" }), (req: any, res: any) => {

  console.log("webhook hit!");
  const provider = req.params.provider as string;

  if (!provider) {
    return res.status(400).json({ error: "No Provider Provided" });
  }

  const adapterFactory = providerRegistry[provider];

  if (!adapterFactory) {
    return res.status(400).json({ error: "Provider not supported" });
  }

  const adapter = adapterFactory();

  try {
    const event = adapter.verifyWebhook(req);     
    console.log("Signature verified!");

    const normalized = adapter.normalizeWebhook(event);

    return res.status(200).json({success: "Signature verified succesfully"});
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return res.status(400).json({ error: "Invalid signature" });
  }

})

export default router;