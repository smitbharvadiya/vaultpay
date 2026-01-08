import { FaTachometerAlt, FaKey, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";
import { RiSecurePaymentFill } from "react-icons/ri";
import { MdOutlinePayments } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";

const SideBar = ({ setIsLogin }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {

        try {
            const confirmLogout = window.confirm("Are you sure you want to logout of VaultPay?");

            if (!confirmLogout) return;

            localStorage.removeItem("selectedApiKey");

            const res = await fetch("http://localhost:5000/logout", {
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
        { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
        { name: "API Keys", icon: <FaKey />, path: "/apikey" },
        { name: "Analytics", icon: <FaChartBar />, path: "/analytics" },
        { name: "Gateways", icon: <RiSecurePaymentFill />, path: "/gateways" },
        { name: "Payments", icon: <MdOutlinePayments />, path: "/Payments" },
    ];

    const bottomItems = [
        { name: "Settings", icon: <FaCog />, path: "/settings" },
        { name: "Logout", icon: <FaSignOutAlt />, action: "logout" },
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
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 group
            ${isActive
                ? "bg-gray-100 text-black"
                : "text-gray-600 hover:bg-gray-50 hover:text-black"
            }
    `}>
        <span
            className={`text-base transition-colors
            ${isActive ? "text-black" : "text-gray-400 group-hover:text-black"}
        `}>
            {item.icon}
        </span>
        {item.name}
    </button>
);

export default SideBar;
