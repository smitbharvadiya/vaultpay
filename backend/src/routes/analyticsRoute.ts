import express from "express"
import RequestLog from "../models/RequestLog";
import apiKey from "../models/apiKey";
import verifyToken from "../middleware/verifyToken";

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

export default router;