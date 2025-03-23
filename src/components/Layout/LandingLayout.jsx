import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import React from "react";
import Navbar from "../Navbar";

function LandingLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default LandingLayout;
