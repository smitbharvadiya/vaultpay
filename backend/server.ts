import "./src/redis";
import { connectRedis } from "./src/redis";
import app from "./src/app";

const PORT = 5000;

(async () => {
    await connectRedis();
})();

app.listen(PORT, () => {
    console.log(`VaultPay backend running on port ${PORT}`);
});