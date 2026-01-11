import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/VaultPayLogo.png";
import { FiBookOpen } from "react-icons/fi";

const DashboardHeader = () => {
    const navigator = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    return (
        <div
            className="fixed top-0 left-0 w-full flex justify-between items-center px-8 z-50 transition-all duration-300 font-jakarta py-4 bg-white/70 backdrop-blur-xl border-b border-[#dfdfdf]"
        >
            <div>
                <a href="/">
                    <img src={logo} alt="VaultPay" className="h-7" />
                </a>
            </div>

            <div className="flex items-center gap-6">
                <div className="cursor-pointer">
                    <a href="/docs">
                        <FiBookOpen className="text-zinc-400 hover:text-zinc-900 transition-colors" size={18} />
                    </a>
                </div>

                <div className="h-8 w-[1px] bg-zinc-200"></div>

                {/* Profile Placeholder */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-transparent group-hover:ring-zinc-100 transition-all">
                        VP
                    </div>
                </div>
            </div>

        </div>
    )
}

export default DashboardHeader;