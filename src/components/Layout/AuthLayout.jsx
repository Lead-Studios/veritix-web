import React from "react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden flex bg-[#e7fdff]">
      <Outlet />

      <img
        src={"/Images/sign_asset_2.svg"}
        alt="Veritixlogo"
        className="absolute bottom-0 right-0 hidden translate-x-16 md:block"
      />
    </div>
  );
}

export default AuthLayout;
