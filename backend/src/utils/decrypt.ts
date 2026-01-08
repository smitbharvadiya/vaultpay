import crypto from 'crypto';

const ALGORITHM = "aes-256-gcm";

const ENCRYPTION_KEY = Buffer.from(
    process.env.ENCRYPTION_KEY!,
    "hex"
);

if (ENCRYPTION_KEY.length !== 32) {
    throw new Error("VAULTPAY_ENCRYPTION_KEY must be 32 bytes");
}

export function decrypt(encryptedData: {
    iv: string;
    content: string;
    authTag: string;
}) {

    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        ENCRYPTION_KEY,
        Buffer.from(encryptedData.iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(encryptedData.authTag, "hex"));

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedData.content, "hex")),
        decipher.final(),
    ]);

    return JSON.parse(decrypted.toString("utf8"));
}
