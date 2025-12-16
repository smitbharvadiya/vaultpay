import { Request, Response, NextFunction } from "express";
import tierLimit from "../config/rateLimitConfig";
import redis from "../redis";

const rateLimit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        const tier = req.userTier || "FREE";

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized - User ID not found"
            });
        }

        const config = tierLimit[tier];
        const now = Date.now();
        const windowMs = config.window * 1000;
        const windowStart = now - windowMs;

        const key = `ratelimit:${userId}`;

        await redis.zRemRangeByScore(key, 0, windowStart);

        const currentCount = await redis.zCard(key);

        if (currentCount >= config.limit) {
            const oldest = await redis.zRangeWithScores(key, 0, 0);
            const oldestTimestamp = oldest[0]?.score ?? now;

            const resetTime = oldestTimestamp + windowMs;
            const retryAfter = Math.ceil((resetTime - now) / 1000);

            return res.status(429).json({
                success: false,
                error: "Rate limit exceeded",
                limit: config.limit,
                window: config.window,
                retryAfter,
                tier
            });
        }

        await redis.zAdd(key, {
            score: now,
            value: now.toString()
        });

        const ttl = await redis.ttl(key);
        if (ttl === -1) {
            await redis.expire(key, config.window + 1);
        }

        res.setHeader("X-RateLimit-Limit", config.limit.toString());
        res.setHeader("X-RateLimit-Remaining", (config.limit - currentCount - 1).toString());
        res.setHeader("X-RateLimit-Reset", Math.ceil((now + windowMs) / 1000).toString());


        next();
    } catch (err) {
        console.error("Rate limiter error:", err);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

export default rateLimit;
