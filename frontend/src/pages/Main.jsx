import { useState } from 'react';
import Header from '../components/header';
import SignUp from '../components/signup';
import Login from '../components/login';
import Hero from '../components/hero';

export default function Main() {
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  return (
    <>
      <Header setOpenSignUp={setOpenSignUp} setOpenLogin={setOpenLogin} isLogin={isLogin} setIsLogin={setIsLogin} />

      <SignUp openSignUp={openSignUp} setOpenSignUp={setOpenSignUp} />
      <Login openLogin={openLogin} setOpenLogin={setOpenLogin} setIsLogin={setIsLogin} setOpenSignUp={setOpenSignUp} />

      <Hero setOpenLogin={setOpenLogin} />
    </>
  );
}
