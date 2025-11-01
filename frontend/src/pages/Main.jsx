import { useState } from 'react';
import Landing from '../components/landing';

export default function Main({setOpenLogin}) {

  return (
    <>
      <Landing setOpenLogin={setOpenLogin} />
    </>
  );
}
