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

        for (const row of payments) {

            if (row._id === "INR") {
                totalInrPaise += row.totalVolume;
            }

            if (row._id === "USD") {
                const usd = row.totalVolume / 100;
                const inr = usd * usdToInr;
                totalInrPaise += Math.round(inr * 100);
            }
        }

        const successfulTransactions = await paymentModel.countDocuments({
            userId: req.userId,
            status: "CAPTURED",
        });


        const failedTransactions = await paymentModel.countDocuments({
            userId: req.userId,
            status: "FAILED",
        });

        const totalConsidered = successfulTransactions + failedTransactions;

        const successRate =
            totalConsidered === 0
                ? 0
                : Math.round((successfulTransactions / totalConsidered) * 100);


        const gateways = await connectedGateway.find({
            userId: req.userId,
            status: "CONNECTED",
            is_active: true,
        }).select("provider");

        const activeGateways = [
            ...new Set(gateways.map(g => g.provider))
        ];

        const activeAPIs = await apiKey.countDocuments({ userId: req.userId });

        return res.status(200).json({
            success: true,
            data: {
                totalVolume: totalInrPaise,
                totalTransactions: successfulTransactions,
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

router.get("/volume/timeseries", verifyToken, async (req, res) => {
    try {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 7);

        const payments = await paymentModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.userId),
                    status: "CAPTURED",
                    createdAt: { $gte: fromDate },
                },
            },
            {
                $group: {
                    _id: {
                        date: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                        },
                        currency: "$currency",
                    },
                    totalAmount: { $sum: "$amount" },
                },
            },
            {
                $sort: { "_id.date": 1 },
            },
        ]);

        // Fetch exchange rate
        const rateRes = await fetch("https://open.er-api.com/v6/latest/USD");
        const rateData = await rateRes.json();
        const usdToInr = rateData.rates.INR;

        // Normalize per day
        const volumeMap: Record<string, number> = {};

        for (const row of payments) {
            const date = row._id.date;

            if (!volumeMap[date]) volumeMap[date] = 0;

            if (row._id.currency === "INR") {
                volumeMap[date] += row.totalAmount;
            }

            if (row._id.currency === "USD") {
                const usd = row.totalAmount / 100;
                const inr = usd * usdToInr;
                volumeMap[date] += Math.round(inr * 100);
            }
        }

        const chartData = Object.entries(volumeMap).map(([date, amount]) => ({
            date,
            volume: amount / 100, // convert paise → rupees
        }));

        res.json({
            success: true,
            data: chartData,
            currency: "INR",
        });
    } catch (err) {
        console.error("Timeseries error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch volume chart",
        });
    }
});


export default router;