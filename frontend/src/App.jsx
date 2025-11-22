import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Dashboard from './pages/Dashboard';
import Header from './components/header';
import SignUp from './components/signup';
import Login from './components/login';
import './App.css'
import { useState } from 'react';
import { useEffect } from 'react';

function App() {

  const [openSignUp, setOpenSignUp] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

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
      }
    };

    checkAuth();

  }, []);

  return (
    <>
      <Router>
        <Header setOpenSignUp={setOpenSignUp} setOpenLogin={setOpenLogin} isLogin={isLogin} setIsLogin={setIsLogin} />

        <SignUp openSignUp={openSignUp} setOpenSignUp={setOpenSignUp} setIsLogin={setIsLogin} setOpenLogin={setOpenLogin} />
        <Login openLogin={openLogin} setOpenLogin={setOpenLogin} setIsLogin={setIsLogin} setOpenSignUp={setOpenSignUp} />

        <Routes>
          <Route path="/" element={<Main setOpenLogin={setOpenLogin} />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
