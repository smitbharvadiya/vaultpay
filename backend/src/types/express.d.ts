declare global{
    namespace Express {
        interface Request {
            userId?: string;
            provider?: string;
        }
    }
}

export {};