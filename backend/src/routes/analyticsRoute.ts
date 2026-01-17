import express from "express"
import RequestLog from "../models/RequestLog";
import apiKey from "../models/apiKey";
import verifyToken from "../middleware/verifyToken";
import paymentModel from "../models/paymentModel";
import mongoose from "mongoose";
import connectedGateway from "../models/connectedGateway";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {

    try {

        const apiKeyId = req.query.apiKeyId as string;

        if (!apiKeyId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const key = await apiKey.findOne({
            _id: apiKeyId,
            userId: req.userId,
        });

        if (!key) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        const totalReq = await RequestLog.countDocuments({ apiKeyId });

        const succesfullReq = await RequestLog.countDocuments({
            apiKeyId,
            success: true
        });

        const failedReq = await RequestLog.countDocuments({
            apiKeyId,
            success: false
        });

        const rpm = await RequestLog.countDocuments({
            apiKeyId,
            createdAt: { $gte: new Date(Date.now() - 60 * 1000) }
        });

        return res.status(200).json({
            success: true,
            totalReq,
            succesfullReq,
            failedReq,
            rpm
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch analytics"
        });
    }

});

router.get("/volume", verifyToken, async (req, res) => {
    try {

        const payments = await paymentModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.userId),
                    status: "CAPTURED",
                }
            },
            {
                $group: {
                    _id: "$currency",
                    totalVolume: { $sum: "$amount" },
                    totalTransactions: { $sum: 1 }
                }
            }
        ]);

        const rateRes = await fetch("https://open.er-api.com/v6/latest/USD");
        const rateData = await rateRes.json();
        const usdToInr = rateData.rates.INR;

        let totalInrPaise = 0;
        let totalTransactions = 0;

        for (const row of payments) {
            totalTransactions += row.totalTransactions;

            if (row._id === "INR") {
                totalInrPaise += row.totalVolume;
            }

            if (row._id === "USD") {
                const usd = row.totalVolume / 100;
                const inr = usd * usdToInr;
                totalInrPaise += Math.round(inr * 100);
            }
        }

        const successTransactions = totalTransactions;

        const totalAttempts = await paymentModel.countDocuments({
            userId: req.userId,
        });

        const successRate =
            totalAttempts === 0
                ? 0
                : Math.round((successTransactions / totalAttempts) * 100);

        const gateways = await connectedGateway.find({
            userId: req.userId,
            status: "CONNECTED",
            is_active: true,
        }).select("provider");

        const activeGateways = [
            ...new Set(gateways.map(g => g.provider))
        ];

        const activeAPIs = await apiKey.countDocuments({userId: req.userId});


        return res.status(200).json({
            success: true,
            data: {
                totalVolume: totalInrPaise,
                totalTransactions,
                currency: "INR",
                activeGateways,
                successRate,
                activeAPIs,
            }
        });

    } catch (err) {
        console.error("Volume error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch total volume"
        });
    }
})

export default router;