import { Outlet } from 'react-router-dom';
import Footer from '../Footer';
import React from 'react';
import Navbar from '../Navbar';

function LandingLayout() {
  return (
    <>
      <Navbar />
      <main className='mt-20'>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default LandingLayout;
