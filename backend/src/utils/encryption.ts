import crypto from 'crypto';

const ALGORITHM = "aes-256-gcm";

const ENCRYPTION_KEY = Buffer.from(
    process.env.ENCRYPTION_KEY!,
    "hex"
);

if (ENCRYPTION_KEY.length !== 32) {
    throw new Error("VAULTPAY_ENCRYPTION_KEY must be 32 bytes");
}

export function encrypt<T extends object>(data: T) {

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

    const encrypted = Buffer.concat([
        cipher.update(JSON.stringify(data), "utf8"),
        cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return {
        iv: iv.toString("hex"),
        content: encrypted.toString("hex"),
        authTag: authTag.toString("hex"),
    };

}