import { Request, Response, NextFunction } from "express";
import RequestLogModel from "../models/RequestLog";

const EXCLUDED_PATHS = ["/health", "/analytics"];

const RequestLogger = (req: Request, res: Response, next: NextFunction) => {

    const startTime = Date.now();

    res.on("finish", async () => {
        try {

            if (EXCLUDED_PATHS.includes(req.path)) return;

            if (!req.apiKey || !req.apiKey.id) return;

            await RequestLogModel.create({
                apiKeyId: req.apiKey.id,
                endpoint: req.originalUrl,
                method: req.method,
                statusCode: res.statusCode,
                success: res.statusCode < 400,
                responseTime: Date.now() - startTime,
                gateway: res.locals.gateway || null,
                timestamp: new Date()
            });

        } catch (err) {
            console.error("Request logging failed", err);
        }
    })
    
    next();
}

export default RequestLogger;