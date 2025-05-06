import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Footer";
import Navbar from "../Navbar";

function LandingLayout() {
  const location = useLocation();

  // Reset scroll position when the route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default LandingLayout;
