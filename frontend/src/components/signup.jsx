import { useState } from "react";

const SignUp = ({ openSignUp, setOpenSignUp }) => {
    if (!openSignUp) return null;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
                alert(data.message || "Signup failed. Try again.");
                return;
            }

            console.log("Sign-up succesfull");
            console.log("✅ Response:", data);

            setOpenSignUp(false);

        } catch (err) {
            console.log("Error: ", err);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
            <div className="w-80 flex flex-col justify-center items-center gap-2 border rounded-md bg-white p-4">
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
            </div>
        </div>
    )
}

export default SignUp;