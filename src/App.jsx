import React from "react";
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Events from './pages/Events';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Help from './pages/Help';
import Navbar from "./components/Navbar";

function App() {
  return (
  <>
  <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/help" element={<Help />} />
          </Routes>

      </>
    
  );
}

export default App;
