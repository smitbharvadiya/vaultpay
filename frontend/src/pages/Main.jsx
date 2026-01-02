import { useState } from 'react';
import Landing from '../components/landing';
import { Navigate } from 'react-router-dom';

export default function Main({isLogin, setOpenLogin}) {

  if (isLogin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <>
      <Landing setOpenLogin={setOpenLogin} />
    </>
  );
}
