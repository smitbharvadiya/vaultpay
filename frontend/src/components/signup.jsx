import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = ({ openSignUp, setOpenSignUp, setIsLogin }) => {
    if (!openSignUp) return null;

    const navigator = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password, email }),
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                setIsError(true);
                setMessage(data.message || "Signup failed. Try again.");
                console.error("❌ Signup failed:", data.message);
                return;
            }

            console.log("Sign-up succesfull");
            console.log("✅ Response:", data);
            setIsError(false);
            setMessage("Account created successfully! 🎉");
            setTimeout(() => {
                setOpenSignUp(false);
                navigator("/dashboard");
            }, 2000);
            setIsLogin(true);

        } catch (err) {
            console.log("Error: ", err);
            setIsError(true);
            setMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
            <div className="w-80 flex flex-col justify-center items-center gap-2 rounded-md bg-white p-4">
                <div className="w-full flex justify-between pb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Signup</h2>
                    <div
                        onClick={() => setOpenSignUp(false)}
                        className="text-gray-500 hover:text-red-500 cursor-pointer transition-transform hover:scale-110">
                        ✕
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                    <input
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                    />
                    <input
                        type="password"
                        placeholder="password"
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="Submit"
                        className="bg-blue-600 text-white cursor-pointer font-medium rounded-lg py-2 mt-2 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                        SignUp
                    </button>
                </form>

                {message && (
                    <div className={`text-sm mt-2 ${isError ? "text-red-500" : "text-green-600"}`}>
                        {message}
                    </div>
                )}
                
            </div>
        </div>
    )
}

export default SignUp;