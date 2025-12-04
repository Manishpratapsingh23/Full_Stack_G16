import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { BookProvider } from './context/BookContext';
import { NotificationProvider } from './context/NotificationContext';
import { RequestProvider } from './context/RequestContext';

import Layout from './components/Layout';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import MyLibrary from './pages/MyLibrary';
import BookDetails from './pages/BookDetails';
import Requests from './pages/Requests';
import Login from './pages/Login';
import Register from './pages/Register';

import './App.css';

/* ---------------------------------------
   Demo Data Setup (from varun-update)
----------------------------------------*/
function initializeDemoData() {
  if (!localStorage.getItem('_demoInit')) {
    localStorage.setItem('users', JSON.stringify([
      { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', status: 'active' },
      { id: 'u2', name: 'Bob Smith', email: 'bob@example.com', status: 'active' },
      { id: 'u3', name: 'Carol White', email: 'carol@example.com', status: 'blocked' },
      { id: 'u4', name: 'David Brown', email: 'david@example.com', status: 'active' }
    ]));

    localStorage.setItem('books', JSON.stringify([
      { id: 'b1', title: '1984', author: 'George Orwell', ownerId: 'u1', status: 'available', genre: 'Dystopian Fiction' },
      { id: 'b2', title: 'Sapiens', author: 'Yuval Noah Harari', ownerId: 'u2', status: 'lent', genre: 'History' },
      { id: 'b3', title: 'To Kill a Mockingbird', author: 'Harper Lee', ownerId: 'u1', status: 'available', genre: 'Classic' },
      { id: 'b4', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', ownerId: 'u2', status: 'swap', genre: 'Classic' },
      { id: 'b5', title: 'Atomic Habits', author: 'James Clear', ownerId: 'u3', status: 'available', genre: 'Self-Help' },
      { id: 'b6', title: 'Dune', author: 'Frank Herbert', ownerId: 'u4', status: 'lent', genre: 'Science Fiction' }
    ]));

    localStorage.setItem('requests', JSON.stringify([
      { id: 'r1', requesterId: 'u2', ownerId: 'u1', bookId: 'b1', status: 'pending' },
      { id: 'r2', requesterId: 'u4', ownerId: 'u2', bookId: 'b2', status: 'approved' },
      { id: 'r3', requesterId: 'u1', ownerId: 'u3', bookId: 'b5', status: 'rejected' },
      { id: 'r4', requesterId: 'u3', ownerId: 'u4', bookId: 'b6', status: 'returned' }
    ]));

    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('_demoInit', 'true');
  }
}

/* ---------------------------------------
   Protected Route
----------------------------------------*/
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/* ---------------------------------------
   Public Route
----------------------------------------*/
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

/* ---------------------------------------
   Main App
----------------------------------------*/
function App() {

  // Load demo data only once
  useEffect(() => {
    initializeDemoData();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <BookProvider>
          <NotificationProvider>
            <RequestProvider>

              <Layout>
                <Routes>

                  {/* Public Routes */}
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />

                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    }
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/my-library"
                    element={
                      <ProtectedRoute>
                        <MyLibrary />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/book/:id"
                    element={
                      <ProtectedRoute>
                        <BookDetails />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/requests"
                    element={
                      <ProtectedRoute>
                        <Requests />
                      </ProtectedRoute>
                    }
                  />

                  {/* fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />

                </Routes>
              </Layout>

            </RequestProvider>
          </NotificationProvider>
        </BookProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
