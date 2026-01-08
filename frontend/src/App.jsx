import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Header from './components/header';
import SignUp from './components/signup';
import Login from './components/login';
import './App.css'
import { useState } from 'react';
import { useEffect } from 'react';
import CreateKey from './components/createKeyBox';
import ApiKey from './components/apiKeys';
import DashboardLayout from './pages/DashboardLayout';
import ProtectedRoutes from '../utils/ProtectedRoutes';
import Analytics from './components/analytics';
import Docs from './components/docs';
import GatewayConnection from './components/gatewayConnect';
import Payments from './components/payments';

function App() {

  const [openSignUp, setOpenSignUp] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/checkAuth", {
          method: "GET",
          credentials: 'include',
        })

        const data = await res.json();

        setIsLogin(data.isAuthenticated);

      } catch (err) {
        console.error("Auth check failed:", err);
      }finally{
        setLoading(false);
      }
    };

    checkAuth();

  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Router>
        <Header setOpenSignUp={setOpenSignUp} setOpenLogin={setOpenLogin} isLogin={isLogin} setIsLogin={setIsLogin} />

        <SignUp openSignUp={openSignUp} setOpenSignUp={setOpenSignUp} setIsLogin={setIsLogin} setOpenLogin={setOpenLogin} />
        <Login openLogin={openLogin} setOpenLogin={setOpenLogin} setIsLogin={setIsLogin} setOpenSignUp={setOpenSignUp} />

        <Routes>
          <Route path="/" element={<Main isLogin={isLogin} setOpenLogin={setOpenLogin} />} />
          <Route path="/docs" element={<Docs />} />
          <Route element={
            <ProtectedRoutes isLogin={isLogin}>
              <DashboardLayout setIsLogin={setIsLogin} />
            </ProtectedRoutes>
          }>
            <Route path="/dashboard" element={<CreateKey />} />
            <Route path="/apikey/create" element={<CreateKey />} />
            <Route path="/apikey" element={<ApiKey />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/gateways" element={<GatewayConnection />} />
            <Route path="/payments" element={<Payments />} />
          </Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
