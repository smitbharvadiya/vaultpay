declare global{
    namespace Express {
        interface Request {
            userId?: string;
            userTier?: string;
            provider?: string;
        }
    }
}

export {};