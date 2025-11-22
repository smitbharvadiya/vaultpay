import { FaTachometerAlt, FaKey, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
        { name: "API Keys", icon: <FaKey />, path: "/apikey" },
        { name: "Analytics", icon: <FaChartBar />, path: "/analytics" },
        { name: "Settings", icon: <FaCog />, path: "/settings" },
        { name: "Logout", icon: <FaSignOutAlt />, path: "/logout" },
    ];

    return (
        <div className="h-screen w-60 flex flex-col p-4 bg-white border-r">
            <h2 className="text-2xl font-bold mb-6">VaultPay</h2>

            <ul className="flex flex-col gap-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <li
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-3 p-2 rounded cursor-pointer 
                                hover:bg-gray-200 transition
                                ${isActive ? "bg-gray-200 font-medium" : ""}
                            `}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default SideBar;
