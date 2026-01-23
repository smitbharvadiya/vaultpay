import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";

const Login = ({ openLogin, setOpenLogin, setIsLogin, setOpenSignUp }) => {
    if (!openLogin) return null;

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("https://vaultpay-4ez5.onrender.com/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                setIsError(true);
                setMessage(data.message || "Login failed. Try again.");
                return;
            }

            setIsError(false);
            setMessage("Logged in successfully.");
            setTimeout(() => {
                setOpenLogin(false);
                setIsLogin(true);
                navigate("/dashboard");
            }, 1200);
        } catch {
            setIsError(true);
            setMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-[360px] rounded-2xl bg-white px-6 py-7 border border-black/10">

                {/* Close */}
                <button
                    onClick={() => setOpenLogin(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors p-1 hover:bg-slate-100 rounded-full"
                >
                    <IoCloseOutline size={24} />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-xl font-semibold text-black tracking-tight">
                        Welcome back
                    </h1>
                    <p className="mt-1 text-sm text-black/60">
                        Log in and get back to building.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm
                       focus:outline-none focus:border-black transition"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm
                       focus:outline-none focus:border-black transition"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-black py-2.5 text-sm font-medium
                       text-white hover:bg-black/90 transition cursor-pointer"
                    >
                        Login
                    </button>
                </form>

                {/* Message */}
                {message && (
                    <p
                        className={`mt-3 text-center text-sm ${isError ? "text-red-500" : "text-green-600"
                            }`}
                    >
                        {message}
                    </p>
                )}

                {/* Footer */}
                <div className="mt-6 flex justify-center gap-1 text-sm text-black/60">
                    <span>New to VaultPay?</span>
                    <button
                        onClick={() => {
                            setOpenLogin(false);
                            setOpenSignUp(true);
                        }}
                        className="font-medium text-black hover:underline cursor-pointer"
                    >
                        Create an account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
