import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const LoginPage = ({ setIsLoggedIn }) => {
  // Email, password, and error message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate(); // Hook for navigation between routes

  // Hardcoded credentials
  const hardcodedEmail = 'username@email.com';
  const hardcodedPassword = 'password';

  // Handler function for form submission
  const handleSubmit = (e) => {
    e.preventDefault(); 
    // Check if entered credentials match the hardcoded
    if (email === hardcodedEmail && password === hardcodedPassword) {
      setIsLoggedIn(true); 
      navigate('/assets'); 
    } else {
      setErrorMessage('Invalid credentials'); 
    }
  };

  return (
    // Outer container with full viewport height, centered content, and gradient background
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">Welcome To Faro Investments</h1>
        <p className="text-center text-gray-600 mb-6">Please login to access your account</p>
        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email input field */}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email" 
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value); // Update email state
                setErrorMessage(''); // Clear error message when user types
              }}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required 
            />
          </div>

          {/* Password input field */}
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password" 
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value); // Update password state
                setErrorMessage(''); // Clear error message when user types
              }}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required // Makes the field required
            />
          </div>

          {/* Display error message if credentials are invalid */}
          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <div className="mt-3 flex flex-col items-center space-y-2">
          {/* Create Account button */}
          <button
            type="button"
            className="w-full bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600"
          >
            Create Account
          </button>
          {/* Forgot Password link */}
          <button
            type="button"
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
