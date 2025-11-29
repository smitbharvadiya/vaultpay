
import express from 'express';

import { PaymentService } from "../PaymentService";
import verifyApiKey from '../middleware/verifyApiKey';

const router = express.Router();

router.post("/create", verifyApiKey, async (req, res) => {
    try {
        const { provider, amount, currency, metadata } = req.body;

        const payment = await PaymentService.createPayment(provider, {
            amount,
            currency,
            metadata,
            userId: req.userId,
        });

        return res.json({
            success: true,
            data: payment
        });
        
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
})

export default router;
