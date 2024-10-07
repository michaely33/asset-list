import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    // If the user is not logged in, redirect them to the login page
    return <Navigate to="/" />;
  }

  // If the user is logged in, render the protected page (children)
  return children;
};

export default ProtectedRoute;
