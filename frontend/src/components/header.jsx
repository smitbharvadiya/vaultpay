import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Header = ({ setOpenSignUp, setOpenLogin, isLogin, setIsLogin }) => {
    const navigator = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {

        try {
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
                navigator("/");
            }
        } catch (err) {
            console.error("Logout error:", err);
        }

    }

    return (
        <div 
            className={`fixed top-0 left-0 w-full flex justify-between items-center px-8 z-50 transition-all duration-300 font-jakarta py-4
            ${isScrolled 
                ? "bg-white/70 backdrop-blur-xl border-b border-[#dfdfdf] shadow-sm" 
                : "bg-transparent border-b-0 border-transparent"
            }`}
        >
            <a href="/" className="text-2xl font-bold">VaultPay</a>
            {!isLogin &&
                <div className="flex gap-6 text-sm font-semibold">
                    <button
                        onClick={() => setOpenLogin(true)}
                        className="group relative px-1 rounded-full cursor-pointer">
                        Login
                        <span className="absolute bottom-1 left-0 w-full h-[2px] bg-black origin-left scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"/>
                    </button>
                    <button
                        onClick={() => setOpenSignUp(true)}
                        className="px-6 py-2 border rounded-full bg-black text-white hover:bg-zinc-800 transition-all duration-200 cursor-pointer">
                        Sign Up
                    </button>
                </div>}
            {isLogin && <button
                onClick={async () => {
                    await handleLogout();
                    setIsLogin(false);
                }}

                className="px-6 py-2 border rounded-full bg-black text-white hover:bg-zinc-800 transition-all duration-200 cursor-pointer">
                Logout
            </button>}
        </div>
    )
}

export default Header;