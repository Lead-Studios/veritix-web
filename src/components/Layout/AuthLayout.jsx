import React from "react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-[#e7fdff]">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
