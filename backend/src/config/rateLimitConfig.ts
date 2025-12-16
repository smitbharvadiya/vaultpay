

interface RateLimitConfig{
    limit: number;
    window: number;
}

const tierLimit: Record<string, RateLimitConfig> = {
    FREE: { limit: 10, window: 60},
    PRO: { limit: 100, window: 60},
    ENTERPRISE: { limit: 1000, window: 60},
}

export default tierLimit;