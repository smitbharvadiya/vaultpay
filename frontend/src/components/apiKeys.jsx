import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";

const ApiKey = () => {
    const [apiKeys, setApiKeys] = useState([]);
    const [error, setError] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchKeys = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/keys/list", {
                    method: "GET",
                    credentials: "include",

                })

                if (!res.ok) {
                    throw new Error("Failed to fetch API keys")
                }

                const data = await res.json()
                setApiKeys(data.apiKeys || [])

            } catch (error) {
                console.log("ERROR: ", error);
            }
        }
        fetchKeys();

    }, []);


    return (
        <div className="p-8 text-gray-900">

            {/* Page Title */}
            <h1 className="text-3xl font-semibold mb-6">API Keys</h1>

            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">

                {/* Description + Create Button */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">
                        API keys are used to authenticate requests to the VaultPay API.
                    </p>

                    <button
                        onClick={() => navigate("/apikey/create")}
                        className="px-4 py-2 text-xs font-semibold cursor-pointer bg-black text-white rounded-full hover:bg-gray-800 transition">
                        Create API key
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4 w-64">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Filter"
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-black focus:outline-none"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="text-left text-gray-700 text-sm font-medium border-b">
                                <th className="pb-3">Name</th>
                                <th className="pb-3">API Key</th>
                                <th className="pb-3">Created At</th>
                            </tr>
                        </thead>

                        <tbody className="text-sm text-gray-800">
                            {apiKeys.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-4 text-center text-gray-500">
                                        No API keys found
                                    </td>
                                </tr>
                            ) : (
                                apiKeys.map((key, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="py-2">{key.name}</td>
                                        <td className="py-2 font-mono text-gray-700">{key.keyMasked}</td>
                                        <td className="py-2">{new Date(key.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                )))}
                        </tbody>

                    </table>
                </div>

            </div>


        </div >
    );
};

export default ApiKey;
