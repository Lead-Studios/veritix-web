import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import React from 'react';


function LandingLayout() {
  return (
    <>
     <Navbar />
     <Outlet />
     <Footer/>
    </>
    
  );
}

export default LandingLayout;
