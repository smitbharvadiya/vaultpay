
import express from 'express';

import { PaymentService } from "../PaymentService";
import verifyApiKey from '../middleware/verifyApiKey';
import paymentModel from '../models/paymentModel';

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

// Get payment status
router.get("/status/:id", verifyApiKey, async(req, res) => {
    const orderId = req.params.id;

    try{
        const payment = await PaymentService.getPaymentStatus(req.params.id);

        return res.status(200).json({ success: true, data: payment });

    }catch(err: any){
        console.log("Error fetching payment status for id: ", orderId, err);
        return res.status(404).json({ success: false, error: err.message });
    }

});

export default router;
