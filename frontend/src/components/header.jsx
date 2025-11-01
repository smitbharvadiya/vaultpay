import { useNavigate } from "react-router-dom";


const Header = ({ setOpenSignUp, setOpenLogin, isLogin, setIsLogin }) => {
    const navigator = useNavigate();

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

            if(res.ok){
                setIsLogin(false);
                navigator("/");
            }
        } catch (err) {
            console.error("Logout error:", err);
        }

    }

    return (
        <div className="sticky top-0 left-0 w-full flex justify-between items-center px-8 py-4 bg-white shadow-sm z-50">
            <h1 className="text-2xl font-bold text-blue-600">VaultPay</h1>
                {!isLogin && 
                <div className="flex gap-4">
                    <button
                    onClick={() => setOpenSignUp(true)}
                    className="px-4 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700">
                    Sign Up
                </button>
                 <button
                    onClick={() => setOpenLogin(true)}
                    className="px-4 py-2 border rounded hover:bg-gray-100">
                    Login
                </button>
                </div> }
                {isLogin && <button
                    onClick={async () => {
                        await handleLogout();
                        setIsLogin(false);
                    }}

                    className="px-4 py-2 border rounded hover:bg-gray-100">
                    Logout
                </button>}
        </div>
    )
}

export default Header;