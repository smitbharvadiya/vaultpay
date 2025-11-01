import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Dashboard from './pages/Dashboard';
import Header from './components/header';
import SignUp from './components/signup';
import Login from './components/login';
import './App.css'
import { useState } from 'react';

function App() {
  
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  return (
    <>
      <Router>
        <Header setOpenSignUp={setOpenSignUp} setOpenLogin={setOpenLogin} isLogin={isLogin} setIsLogin={setIsLogin} />

      <SignUp openSignUp={openSignUp} setOpenSignUp={setOpenSignUp} setIsLogin={setIsLogin} />
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
