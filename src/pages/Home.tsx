import React from 'react'

function Home() {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Our Website</h1>
        <p className="text-lg text-gray-600">This is the home page of our amazing application.</p>
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Featured Content</h2>
          <p className="text-gray-600">Check out some of our featured content and latest updates.</p>
        </div>
      </div>
    );
  }
  
  export default Home;