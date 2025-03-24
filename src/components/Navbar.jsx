import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import PropTypes from "prop-types";

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`${
        isActive
          ? "text-[#00FFA0] border-b-2 border-[#00FFA0]"
          : "text-white hover:text-[#00FFA0] border-b-2 border-transparent"
      } pb-1 transition-colors ease-in-out duration-300 !cursor-pointer`}
    >
      {children}
    </Link>
  );
}

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#000625] z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 space-x-4 lg:space-x-8">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold text-white"
          >
            <img
              src={"/veritix_logo.svg"}
              alt="Veritixlogo"
              className="w-16 h-16 sm:w-24 sm:h-24"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="items-center hidden space-x-4 md:flex lg:space-x-8 whitespace-nowrap max-lg:text-sm">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/upcoming-events">Upcoming Events</NavLink>
            <NavLink to="/how-it-works">How it Works</NavLink>
          </div>
          <div className="items-center hidden space-x-4 md:flex lg:space-x-8 whitespace-nowrap max-lg:text-sm">
            <Link
              to="#"
              className="text-[#00FFA0] border border-[#00FFA0] px-6 py-2 rounded-full hover:bg-[#00FFA0] hover:text-[#000625] transition-colors"
            >
              Connect Wallet
            </Link>
            <Link
              to="/signup"
              className="bg-[#00FFA0] text-[#000625] px-6 py-2 rounded-full font-medium hover:bg-[#00FFA0]/90 transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="z-50 text-2xl text-white md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[70%] bg-[#000625] transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col px-6 pt-20 space-y-6">
          <Link
            to="/"
            className="text-[#00FFA0] text-lg border-b border-[#00FFA0] pb-1 w-fit"
            onClick={toggleMobileMenu}
          >
            Home
          </Link>
          <Link
            to="/upcoming-events"
            className="text-lg text-white"
            onClick={toggleMobileMenu}
          >
            Upcoming Events
          </Link>
          <Link
            to="/how-it-works"
            className="text-lg text-white"
            onClick={toggleMobileMenu}
          >
            How it Works
          </Link>
          <Link
            to="/connect-wallet"
            className="text-[#00FFA0] border border-[#00FFA0] px-6 py-2 rounded-full text-center"
            onClick={toggleMobileMenu}
          >
            Connect Wallet
          </Link>
          <Link
            to="/sign-up"
            className="bg-[#00FFA0] text-[#000625] px-6 py-2 rounded-full font-medium text-center"
            onClick={toggleMobileMenu}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
