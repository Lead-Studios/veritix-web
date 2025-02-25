import React from 'react'

function Help() {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Help & Support</h1>
        <p className="text-lg text-gray-600 mb-6">Find answers to common questions and get support.</p>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">How do I create an account?</h3>
              <p className="text-gray-600">
                To create an account, click on the "Sign Up" button in the top right corner and follow the instructions.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">How can I reset my password?</h3>
              <p className="text-gray-600">
                Go to the login page and click on "Forgot Password". Follow the instructions sent to your email.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                Yes, we offer a 30-day money-back guarantee on all our plans.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Need more help?</h2>
          <p className="text-gray-600 mb-4">
            Our support team is available 24/7 to assist you with any questions or issues.
          </p>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Contact Support
          </button>
        </div>
      </div>
    );
}

export default Help