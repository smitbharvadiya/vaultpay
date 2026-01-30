import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Header from './components/header';
import SignUp from './components/signup';
import Login from './components/login';
import './App.css'
import { useState } from 'react';
import CreateKey from './components/createKeyBox';
import ApiKey from './components/apiKeys';
import DashboardLayout from './pages/DashboardLayout';
// import ProtectedRoutes from '../utils/ProtectedRoutes';
import Docs from './components/docs';
import GatewayConnection from './components/gatewayConnect';
import Transactions from './components/transactions';
import Dashboard from './components/dashboard';
import Webhooks from './components/webhooks';
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {

  const [openSignUp, setOpenSignUp] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const isModalOpen = openSignUp || openLogin;

  return (
    <>
      <Router>

        <SignUp
          openSignUp={openSignUp}
          setOpenSignUp={setOpenSignUp}
          setIsLogin={setIsLogin}
          setOpenLogin={setOpenLogin}
        />
        <Login
          openLogin={openLogin}
          setOpenLogin={setOpenLogin}
          setIsLogin={setIsLogin}
          setOpenSignUp={setOpenSignUp}
        />

        <div className={` ${isModalOpen ? "blur-md brightness-90 pointer-events-none" : "blur-0"}`}>
          <Routes>
            {/* LANDING PAGE */}
            <Route path="/" element={
              <>
                <Header setOpenSignUp={setOpenSignUp} setOpenLogin={setOpenLogin} isLogin={isLogin} setIsLogin={setIsLogin} />
                <Main isLogin={isLogin} setOpenSignUp={setOpenSignUp} />
              </>
            } />

            <Route path="/docs" element={
              <>
                <Header setOpenSignUp={setOpenSignUp} setOpenLogin={setOpenLogin} isLogin={isLogin} setIsLogin={setIsLogin} />
                <Docs />
              </>
            } />

            {/* DASHBOARD */}
            <Route element={<ProtectedRoutes setIsLogin={setIsLogin} />}>
              <Route element={<DashboardLayout setIsLogin={setIsLogin} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/apikey/create" element={<CreateKey />} />
                <Route path="/apikey" element={<ApiKey />} />
                <Route path="/gateways" element={<GatewayConnection />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/webhooks" element={<Webhooks />} />
              </Route>
            </Route>

          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
