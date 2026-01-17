import app from "./src/app";
import { connectRedis } from "./src/redis";

const PORT = 5000;

const startServer = async () => {
  await connectRedis(); // connect once

  app.listen(PORT, () => {
    console.log(`🚀 VaultPay backend running on port ${PORT}`);
  });
};

startServer();