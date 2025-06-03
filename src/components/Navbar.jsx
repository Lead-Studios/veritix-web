import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/auth";

function NavLink({ to, children, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  const handleClick = (e) => {
    if (to.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(to);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      if (onClick) onClick();
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`${
        isActive ? "text-blue-500 border-b-2 border-blue-500" : "text-white hover:text-blue-400 border-b-2 border-transparent"
      } pb-1 transition-colors ease-in-out duration-300 !cursor-pointer`}
    >
      {children}
    </Link>
  );
}

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#000625] z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 space-x-4 lg:space-x-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-white">
            <img src={"/veritix_logo.svg"} alt="Veritixlogo" className="w-16 h-16 sm:w-24 sm:h-24" />
          </Link>

          {/* Desktop Menu */}
          <div className="items-center hidden space-x-4 md:flex lg:space-x-8 whitespace-nowrap max-lg:text-sm">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/explore">Explore</NavLink>
            <NavLink to="#how-it-works">How it Works</NavLink>
            <NavLink to="#get-in-touch">Get in Touch</NavLink>
          </div>
          <div className="items-center hidden space-x-4 md:flex lg:space-x-8 whitespace-nowrap max-lg:text-sm">
            <Link to="#" className="text-blue-500 border border-blue-500 px-6 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors">
              Connect Wallet
            </Link>
            {isAuthenticated ? (
              <span className="text-white">Hello, {user?.userName || user?.username || "User"}</span>
            ) : (
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:from-blue-600 hover:to-indigo-700 transition-colors"
              >
                Sign Up
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="z-50 text-2xl text-white md:hidden" onClick={toggleMobileMenu}>
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
          <Link to="/" className="text-blue-500 text-lg border-b border-blue-500 pb-1 w-fit" onClick={toggleMobileMenu}>
            Home
          </Link>
          <Link to="/explore" className="text-lg text-white" onClick={toggleMobileMenu}>
            Explore
          </Link>
          <Link to="/how-it-works" className="text-lg text-white" onClick={toggleMobileMenu}>
            How it Works
          </Link>
          <Link to="/get-in-touch" className="text-lg text-white" onClick={toggleMobileMenu}>
            Get in Touch
          </Link>
          <Link
            to="/connect-wallet"
            className="text-blue-500 border border-blue-500 px-6 py-2 rounded-full text-center hover:bg-blue-500 hover:text-white transition-colors"
            onClick={toggleMobileMenu}
          >
            Connect Wallet
          </Link>
          {isAuthenticated ? (
            <span className="text-white text-center">Hello, {user?.userName || user?.username || "User"}</span>
          ) : (
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full font-medium text-center hover:from-blue-600 hover:to-indigo-700 transition-colors"
              onClick={toggleMobileMenu}
            >
              Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
