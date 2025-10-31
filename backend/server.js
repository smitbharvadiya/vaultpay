import app from "./src/app.js";

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`VaultPay backend running on port ${PORT}`);
});