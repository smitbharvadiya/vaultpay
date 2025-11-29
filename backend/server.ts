import app from "./src/app";

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`VaultPay backend running on port ${PORT}`);
});