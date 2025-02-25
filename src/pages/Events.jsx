import React from 'react'

function Events() {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Events</h1>
        <p className="text-lg text-gray-600 mb-6">Discover our upcoming events and activities.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Conference 2025</h2>
            <p className="text-gray-600 mb-4">Join us for our annual conference with industry experts.</p>
            <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">March 15-17</span>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Workshop Series</h2>
            <p className="text-gray-600 mb-4">Practical workshops to enhance your skills.</p>
            <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">Every Tuesday</span>
          </div>
        </div>
      </div>
    );
  }

  export default Events;