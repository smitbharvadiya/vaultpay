import { useState } from 'react';
import Landing from '../components/landing';
import { Navigate } from 'react-router-dom';

export default function Main({isLogin, setOpenSignUp}) {

  if (isLogin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <>
      <Landing setOpenSignUp={setOpenSignUp} />
    </>
  );
}
