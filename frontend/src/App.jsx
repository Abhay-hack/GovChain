// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext.jsx';
import { AlertProvider } from './contexts/AlertContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Tenders from './pages/Tenders.jsx';
import Vendors from './pages/Vendors.jsx';
import Payments from './pages/Payments.jsx';
import Verify from './pages/Verify.jsx';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import CreateTender from './components/CreateTender';
import { logout, checkAuth } from './utils/api';
import './App.css';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await checkAuth();
        console.log('checkAuth response:', response);
        if (response.isAuthenticated) {
          console.log('Setting isAuthenticated to true');
          setIsAuthenticated(true);
        } else {
          console.log('User not authenticated according to backend');
        }
      } catch (error) {
        console.error('Auth verification failed:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <WalletProvider>
      <AlertProvider>
        <Router>
          <div className="app">
            <Header isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
            <main>
              <Routes>
                <Route
                  path="/"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/home" />
                    ) : (
                      <Signup setIsAuthenticated={setIsAuthenticated} />
                    )
                  }
                />
                <Route
                  path="/login"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/home" />
                    ) : (
                      <Login setIsAuthenticated={setIsAuthenticated} />
                    )
                  }
                />
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tenders"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <Tenders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendors"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <Vendors />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-tender"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <CreateTender />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payments"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <Payments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/verify"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <Verify />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Profile />
                    </ProtectedRoute>}
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AlertProvider>
    </WalletProvider>
  );
}

export default App;