import React from 'react'

function About() {
  return (
    <div className="max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">About Us</h1>
    <p className="text-lg text-gray-600 mb-6">Learn more about our company and mission.</p>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Our Story</h2>
      <p className="text-gray-600 mb-4">
        We started with a simple idea: to create amazing experiences for our users. 
        Since then, we've grown into a team of passionate individuals dedicated to innovation.
      </p>
      <p className="text-gray-600">
        Our mission is to provide outstanding service and value to our customers through 
        continuous improvement and dedication to excellence.
      </p>
    </div>
  </div>
  )
}

export default About