import React from 'react'

function Pricing() {
  return (
    <div className="max-w-4xl min-h-screen mx-auto py-4">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Pricing Plans</h1>
    <p className="text-lg text-gray-600 mb-6">Choose the plan that works best for you.</p>
    <div className="grid gap-6 md:grid-cols-3">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Basic</h2>
        <p className="text-gray-500 mb-4">Perfect for individuals</p>
        <p className="text-3xl font-bold text-gray-800 mb-6">$9<span className="text-lg font-normal text-gray-600">/month</span></p>
        <ul className="space-y-2 mb-6">
          <li className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">Feature 1</span>
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">Feature 2</span>
          </li>
        </ul>
        <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Get Started
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border-2 border-indigo-500">
        <div className="absolute inset-x-0 top-0">
          <div className="flex justify-center">
            <span className="inline-flex rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold tracking-wider uppercase text-white">Popular</span>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Pro</h2>
        <p className="text-gray-500 mb-4">For small teams</p>
        <p className="text-3xl font-bold text-gray-800 mb-6">$29<span className="text-lg font-normal text-gray-600">/month</span></p>
        <ul className="space-y-2 mb-6">
          <li className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">Everything in Basic</span>
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">Feature 3</span>
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">Feature 4</span>
          </li>
        </ul>
        <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Get Started
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Enterprise</h2>
        <p className="text-gray-500 mb-4">For large organizations</p>
        <p className="text-3xl font-bold text-gray-800 mb-6">$99<span className="text-lg font-normal text-gray-600">/month</span></p>
        <ul className="space-y-2 mb-6">
          <li className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">Everything in Pro</span>
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">Feature 5</span>
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">Feature 6</span>
          </li>
        </ul>
        <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Contact Sales
        </button>
      </div>
    </div>
  </div>
  )
}

export default Pricing