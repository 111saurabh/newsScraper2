import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-primary-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold">The News Scraper</Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/news" className="hover:text-primary-200">News Feed</Link>
              {isAuthenticated && (
                <Link to="/notes" className="hover:text-primary-200">My Notes</Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="hidden md:inline">Hello, {currentUser.username}</span>
                <Link to="/profile" className="hover:text-primary-200">Profile</Link>
                <button 
                  onClick={logout}
                  className="bg-primary-700 hover:bg-primary-800 px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-200">Login</Link>
                <Link 
                  to="/register" 
                  className="bg-primary-700 hover:bg-primary-800 px-3 py-1 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
