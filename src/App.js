import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './LoginPage';
import AssetListPage from './AssetListPage'; // Placeholder for asset page component
import ProtectedRoute from './ProtectedRoute'; // Import the protected route

function App() {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public Login Page */}
        <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />

        {/* Protected Route for AssetListPage */}
        <Route
          path="/assets"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AssetListPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

