import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";


const CreateKey = () => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGenerateKey = async () => {

        try {
            const res = await fetch("http://localhost:5000/api/keys/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ name })
            })

            const data = await res.json();
            console.log(data);

            if (!res.ok) {
                console.log(data.err || "Failed to generate Key");
                return;
            }

            navigate("/apikey");

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center gap-1 text-gray-700 pb-4">
                <span
                    onClick={() => navigate("/apikey")}
                    className="cursor-pointer hover:text-black transition flex items-center pr-2"
                >
                    <GoArrowLeft size={20} />
                </span>
                <span className="text-gray-500">API Keys</span>
                <span className="text-gray-400">/</span>
                <span className="font-medium">Create</span>
            </div>

            <h1 className="text-2xl font-semibold mb-6">Create API Key</h1>
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 max-w-md">
                <label className="block text-gray-700 mb-2 font-medium">Key Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Production Key"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
                />

                <button
                    onClick={handleGenerateKey}
                    className="px-4 py-2 text-sm bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition"
                >
                    Create API Key
                </button>
            </div>
        </div>
    )
}

export default CreateKey;