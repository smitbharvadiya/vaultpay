import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoutes = ({ setIsLogin }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          "https://vaultpay-4ez5.onrender.com/checkAuth",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        setAuthenticated(data.isAuthenticated);
        setIsLogin?.(data.isAuthenticated);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
