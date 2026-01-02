
import express from 'express';

import { PaymentService } from "../PaymentService";
import verifyApiKey from '../middleware/verifyApiKey';
import rateLimit from '../middleware/rateLimit';
import RequestLogger from '../middleware/reqLogger';

const router = express.Router();

router.use(verifyApiKey);
router.use(rateLimit);
router.use(RequestLogger);

router.post("/create", async (req, res) => {
    try {
        const { provider, amount, currency, metadata } = req.body;
            
        res.locals.gateway = provider;

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

// Get payment status
router.get("/status/:id", async (req, res) => {
    const orderId = req.params.id;

    try {
        const payment = await PaymentService.getPaymentStatus(req.params.id);

        res.locals.gateway = payment.provider;

        return res.status(200).json({ success: true, data: payment });

    } catch (err: any) {
        console.log("Error fetching payment status for id: ", orderId, err);
        return res.status(404).json({ success: false, error: err.message });
    }
});

router.post("/refund", async (req, res) => {
    try {
        const { paymentId, amount, speed } = req.body;

        if (!paymentId) {
            return res.status(400).json({ success: false, error: "paymentId is required" });
        }

        const refund = await PaymentService.refundPayment({ paymentId, amount, speed });

        res.locals.gateway = refund.provider;

        return res.json({ success: true, data: refund });

    } catch (err: any) {
        console.error("Refund route error:", err);
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

export default router;
