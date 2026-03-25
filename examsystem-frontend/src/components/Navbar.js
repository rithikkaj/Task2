import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary-700 text-white shadow-lg">
      <div className="container flex justify-between items-center py-4">
        <Link to="/" className="text-2xl font-bold">
          Exam System
        </Link>

        <div className="flex items-center gap-8">
          {isAuthenticated ? (
            <>
              <span className="text-sm">Welcome, {user?.name}</span>
              {user?.role === 'STUDENT' && (
                <Link to="/student-dashboard" className="hover:bg-primary-600 px-3 py-2 rounded">
                  Dashboard
                </Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link to="/admin-dashboard" className="hover:bg-primary-600 px-3 py-2 rounded">
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="btn-secondary text-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
