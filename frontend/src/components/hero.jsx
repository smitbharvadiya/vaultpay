import { useState } from "react";
import SignUp from "../components/signup";
import Login from "../components/login";

const Hero = ({setOpenLogin}) => {

  const handleGenerateKey = () => {
    setOpenLogin(true);
  };

  return (
    <div className="relative flex flex-col justify-center items-center min-h-[calc(100vh-80px)] bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">

      {/* ---------- Main Content ---------- */}
      <main className="flex flex-col items-center text-center max-w-2xl mt-16">
        <h2 className="text-4xl font-bold mb-4">Secure API Payments for Developers</h2>
        <p className="text-gray-600 mb-8">
          VaultPay helps you integrate secure, token-based payments into your
          applications with just a few lines of code. Generate your API key and
          start building in minutes.
        </p>

        <button
          onClick={handleGenerateKey}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition-all"
        >
          Generate API Key
        </button>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} VaultPay — Empowering Developers
      </footer>

    </div>
  );
}

export default Hero;
