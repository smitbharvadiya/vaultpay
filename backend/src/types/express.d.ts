declare global{
    namespace Express {
        interface Request {
            userId?: string;
            userTier?: string;
            provider?: string;
            apiKey?: {
                id: string,
            }
        }
    }
}

export {};