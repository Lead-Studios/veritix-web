import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import PropTypes from "prop-types";

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
      className={`relative group ${
        isActive ? "text-blue-400" : "text-white hover:text-blue-300"
      } pb-1 transition-all duration-300 ease-in-out cursor-pointer font-medium`}
    >
      {children}
      {/* Animated underline */}
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-300 ease-out ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
      ></span>
      {/* Hover glow effect */}
      <span className="absolute inset-0 rounded-md bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#000625]/95 backdrop-blur-md border-b border-blue-900/20 z-50 shadow-lg">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 space-x-4 lg:space-x-8">
          {/* Logo with hover effect */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold text-white group transition-transform duration-300 hover:scale-105"
          >
            <img
              src={"/veritix_logo.svg"}
              alt="Veritixlogo"
              className="w-16 h-16 sm:w-24 sm:h-24 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="items-center hidden space-x-6 md:flex lg:space-x-8 whitespace-nowrap max-lg:text-sm">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/explore">Explore</NavLink>
            <NavLink to="#how-it-works">How it Works</NavLink>
            <NavLink to="#get-in-touch">Get in Touch</NavLink>
          </div>

          {/* Action buttons with enhanced hover effects */}
          <div className="items-center hidden space-x-4 md:flex lg:space-x-6 whitespace-nowrap max-lg:text-sm">
            <Link
              to="#"
              className="relative group text-blue-400 border border-blue-500/50 px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:bg-blue-500 hover:text-white hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Connect Wallet</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/signup"
              className="relative group bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">Sign Up</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700"></div>
            </Link>
          </div>

          {/* Mobile Menu Button with animation */}
          <button
            className="z-50 text-2xl text-white md:hidden p-2 rounded-lg transition-all duration-300 hover:bg-blue-500/20 hover:text-blue-300 active:scale-90"
            onClick={toggleMobileMenu}
          >
            <div className="relative w-6 h-6">
              <HiMenu
                className={`absolute inset-0 transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "opacity-0 rotate-180"
                    : "opacity-100 rotate-0"
                }`}
              />
              <HiX
                className={`absolute inset-0 transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "opacity-100 rotate-0"
                    : "opacity-0 -rotate-180"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar with backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-40"
          onClick={toggleMobileMenu}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[75%] max-w-sm bg-gradient-to-b from-[#000625] to-[#0a0e21] border-l border-blue-900/30 transform transition-all duration-300 ease-out shadow-2xl ${
          isMobileMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        } md:hidden z-50`}
      >
        <div className="flex flex-col px-6 pt-20 space-y-6">
          {/* Mobile navigation links with stagger animation */}
          {[
            { to: "/", label: "Home", isActive: true },
            { to: "/explore", label: "Explore" },
            { to: "/how-it-works", label: "How it Works" },
            { to: "/get-in-touch", label: "Get in Touch" },
          ].map((item, index) => (
            <Link
              key={item.to}
              to={item.to}
              className={`group relative text-lg transition-all duration-300 hover:text-blue-300 hover:translate-x-2 ${
                item.isActive
                  ? "text-blue-400 border-b border-blue-500 pb-1 w-fit"
                  : "text-white"
              }`}
              onClick={toggleMobileMenu}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="relative z-10">{item.label}</span>
              <div className="absolute inset-0 bg-blue-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </Link>
          ))}

          {/* Mobile action buttons */}
          <div className="pt-4 space-y-4">
            <Link
              to="/connect-wallet"
              className="block text-blue-400 border border-blue-500/50 px-6 py-3 rounded-full text-center font-medium transition-all duration-300 hover:bg-blue-500 hover:text-white hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              onClick={toggleMobileMenu}
            >
              Connect Wallet
            </Link>
            <Link
              to="/sign-up"
              className="block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full font-medium text-center transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95"
              onClick={toggleMobileMenu}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
