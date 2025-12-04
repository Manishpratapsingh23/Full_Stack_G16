import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

/**
 * Layout Component
 * Provides the main navigation and structure for all pages
 * Includes header, navigation, and footer
 */
const Layout = ({ children }) => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if current route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-2xl font-bold text-gray-900">BookSwap</span>
            </Link>

            {/* Navigation - Desktop */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center space-x-1">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive('/') 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/my-library"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive('/my-library') 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  My Library
                </Link>
                <Link
                  to="/requests"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive('/requests') 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Requests
                </Link>
              </nav>
            )}

            {/* Right Side - Notifications & User Menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Notification Bell */}
                  <NotificationBell />

                  {/* User Menu */}
                  <div className="flex items-center space-x-3">
                    <div className="hidden md:block text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">{currentUser?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isAuthenticated && (
            <nav className="md:hidden flex items-center space-x-1 pb-3 overflow-x-auto">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  isActive('/') 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>
              <Link
                to="/my-library"
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  isActive('/my-library') 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                My Library
              </Link>
              <Link
                to="/requests"
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  isActive('/requests') 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Requests
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2025 BookSwap Platform. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                About
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
