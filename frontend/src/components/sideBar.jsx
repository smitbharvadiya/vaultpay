import { FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";
import { FiKey } from "react-icons/fi";
import { RiSecurePaymentFill } from "react-icons/ri";
import { MdKeyboardArrowRight, MdOutlinePayment } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";


const SideBar = ({ setIsLogin }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {

        try {
            const confirmLogout = window.confirm("Are you sure you want to logout of VaultPay?");

            if (!confirmLogout) return;

            localStorage.removeItem("selectedApiKey");

            const res = await fetch("https://vaultpay-backend.onrender.com/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            const data = await res.json();
            console.log(data);

            if (res.ok) {
                setIsLogin(false);
                navigate("/");
            }
        } catch (err) {
            console.error("Logout error:", err);
        }

    }

    const menuItems = [
        { name: "Dashboard", icon: <LuLayoutDashboard />, path: "/dashboard" },
        { name: "API Keys", icon: <FiKey />, path: "/apikey" },
        { name: "Analytics", icon: <FaChartBar />, path: "/analytics" },
        { name: "Gateways", icon: <RiSecurePaymentFill />, path: "/gateways" },
        { name: "Transactions", icon: <MdOutlinePayment />, path: "/Transactions" },
    ];

    const bottomItems = [
        { name: "Settings", icon: <FaCog />, path: "/settings" },
        { name: "Log Out", icon: <FaSignOutAlt />, action: "logout" },
    ];

    return (
        <div className="h-full w-64 flex flex-col bg-white border-r border-gray-200">

            {/* Main Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {menuItems.map((item) => (
                    <NavItem
                        key={item.name}
                        item={item}
                        isActive={location.pathname === item.path}
                        onClick={() => navigate(item.path)}
                    />
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="px-4 py-4 border-t border-gray-200">
                <div className="space-y-1">
                    {bottomItems.map((item) => (
                        <NavItem
                            key={item.name}
                            item={item}
                            isActive={location.pathname === item.path}
                            onClick={item.action === "logout" ? handleLogout : () => navigate(item.path)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const NavItem = ({ item, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex justify-between items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 group cursor-pointer
            ${isActive
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-50 hover:text-black"
            }
    `}>
        <div className="flex items-center gap-3">
            <span
                className={`text-base transition-colors
            ${isActive ? "text-white" : "text-gray-400 group-hover:text-black"}
        `}>
                {item.icon}
            </span>
            {item.name}
        </div>

        {isActive && (<span className="">
            <MdKeyboardArrowRight size={18} />
        </span>)}
    </button>
);

export default SideBar;
