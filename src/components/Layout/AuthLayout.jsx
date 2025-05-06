import React from 'react';
import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden flex bg-[#E6EAFF]">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
