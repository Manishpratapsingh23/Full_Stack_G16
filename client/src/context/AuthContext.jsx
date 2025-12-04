import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Hook to use AuthContext in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function - stores user in localStorage
  const login = (email, password) => {
    // Get all users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find matching user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, message: 'Invalid email or password' };
  };

  // Register function - creates new user
  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      return { success: false, message: 'Email already registered' };
    }
    
    // Create new user with unique ID
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: 'user', // default role
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login after registration
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    return { success: true, user: userWithoutPassword };
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Update user profile
  const updateProfile = (updates) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('users', JSON.stringify(users));
      
      const updatedUser = { ...users[userIndex] };
      delete updatedUser.password;
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return { success: true };
    }
    
    return { success: false, message: 'User not found' };
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
