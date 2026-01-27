import { useState } from "react";
import { FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";
import { FiKey } from "react-icons/fi";
import { RiSecurePaymentFill } from "react-icons/ri";
import { MdKeyboardArrowRight, MdOutlinePayment } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { LuLayoutDashboard, LuWebhook } from "react-icons/lu";
import { PanelLeft, PanelLeftClose } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


const SideBar = ({ setIsLogin }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = async () => {
        try {
            const confirmLogout = window.confirm("Are you sure you want to logout of VaultPay?");
            if (!confirmLogout) return;

            localStorage.removeItem("selectedApiKey");

            const res = await fetch("https://vaultpay-4ez5.onrender.com/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (res.ok) {
                setIsLogin(false);
                navigate("/");
            }
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const menuItems = [
        { name: "Dashboard", icon: <LuLayoutDashboard />, path: "/dashboard" },
        { name: "API Keys", icon: <FiKey />, path: "/apikey" },
        { name: "Analytics", icon: <FaChartBar />, path: "/analytics" },
        { name: "Gateways", icon: <RiSecurePaymentFill />, path: "/gateways" },
        { name: "Transactions", icon: <MdOutlinePayment />, path: "/Transactions" },
        { name: "Webhooks", icon: <LuWebhook />, path: "/webhooks" },
    ];

    const bottomItems = [
        { name: "Settings", icon: <FaCog />, path: "/settings" },
        { name: "Log Out", icon: <FaSignOutAlt />, action: "logout" },
    ];

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{
                x: 0,
                opacity: 1,
                width: isCollapsed ? 80 : 256
            }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="h-full flex flex-col bg-white border-r border-gray-200"
        >
            {/* Top Header */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
                className={`px-3 pt-3 flex ${isCollapsed ? "justify-center" : "justify-start"}`}
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                    {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
                </motion.button>
            </motion.div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 pt-2 pb-6 space-y-1">
                {menuItems.map((item, index) => (
                    <NavItem
                        key={item.name}
                        item={item}
                        index={index}
                        delayBase={0.1}
                        isActive={location.pathname === item.path}
                        isCollapsed={isCollapsed}
                        onClick={() => navigate(item.path)}
                    />
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="px-3 py-4 border-t border-gray-200 space-y-1">
                {bottomItems.map((item, index) => (
                    <NavItem
                        key={item.name}
                        item={item}
                        index={index}
                        delayBase={0.5}
                        isActive={location.pathname === item.path}
                        isCollapsed={isCollapsed}
                        onClick={item.action === "logout" ? handleLogout : () => navigate(item.path)}
                    />
                ))}
            </div>
        </motion.div>
    );
};

const NavItem = ({ item, isActive, isCollapsed, onClick, index, delayBase = 0.1 }) => (
    <motion.button
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: delayBase + index * 0.05 }}
        whileHover={{ x: isActive ? 0 : 2 }}
        onClick={onClick}
        className={`relative flex items-center transition-colors duration-150 cursor-pointer group
            ${isCollapsed
                ? "justify-center w-11 h-10 mx-auto rounded-xl"
                : "justify-between w-full px-3 py-2.5 rounded-lg"
            } 
            ${isActive
                ? "bg-black text-white shadow-md shadow-black/10"
                : "text-gray-600 hover:bg-gray-100 hover:text-black"
            }
        `}
    >
        <div className="flex items-center gap-3">
            <span
                className={`text-base transition-transform ${
                    isActive 
                        ? "text-white" 
                        : "text-gray-400 group-hover:text-black group-hover:scale-105"
                }`}
            >
                {item.icon}
            </span>

            <AnimatePresence>
                {!isCollapsed && (
                    <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap overflow-hidden"
                    >
                        {item.name}
                    </motion.span>
                )}
            </AnimatePresence>
        </div>

        <AnimatePresence>
            {!isCollapsed && isActive && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <MdKeyboardArrowRight size={18} />
                </motion.div>
            )}
        </AnimatePresence>
    </motion.button>
);

export default SideBar;
