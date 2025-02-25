import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white max-w-4xl mx-auto shadow-md">
      <div className="container px-4">
        <div className="flex items-center justify-between h-16">
          <div>
            <Link to="/" className="text-xl font-bold text-indigo-600">Veritix</Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/" className="px-3 py-2 text-gray-700 hover:text-indigo-600">Home</Link>
            <Link to="/events" className="px-3 py-2 text-gray-700 hover:text-indigo-600">Events</Link>
            <Link to="/about" className="px-3 py-2 text-gray-700 hover:text-indigo-600">About</Link>
            <Link to="/contact" className="px-3 py-2 text-gray-700 hover:text-indigo-600">Contact</Link>
            <Link to="/pricing" className="px-3 py-2 text-gray-700 hover:text-indigo-600">Pricing</Link>
            <Link to="/help" className="px-3 py-2 text-gray-700 hover:text-indigo-600">Help</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;