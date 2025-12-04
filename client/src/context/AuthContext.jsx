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
    
    // Validate role
    const validRoles = ['reader', 'book_owner', 'admin'];
    const userRole = userData.role && validRoles.includes(userData.role) ? userData.role : 'reader';
    
    // Create new user with unique ID and extended profile fields
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || '',
      address: userData.address || '',
      city: userData.city || '',
      zipCode: userData.zipCode || '',
      profilePicture: userData.profilePicture || null,
      preferences: userData.preferences || {
        notifications: true,
        publicProfile: true,
        shareLocation: false,
        preferredSwapType: 'both' // 'swap', 'lend', 'donate', or 'both'
      },
      bio: userData.bio || '',
      role: userRole,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
      // Don't allow direct password update through this method
      const { password, ...safeUpdates } = updates;
      users[userIndex] = { 
        ...users[userIndex], 
        ...safeUpdates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('users', JSON.stringify(users));
      
      const updatedUser = { ...users[userIndex] };
      delete updatedUser.password;
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    }
    
    return { success: false, message: 'User not found' };
  };

  // Change password
  const changePassword = (currentPassword, newPassword) => {
    if (!currentUser) {
      return { success: false, message: 'User not authenticated' };
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    if (users[userIndex].password !== currentPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }

    if (newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters' };
    }

    users[userIndex].password = newPassword;
    users[userIndex].updatedAt = new Date().toISOString();
    localStorage.setItem('users', JSON.stringify(users));

    return { success: true, message: 'Password changed successfully' };
  };

  // Get user by ID
  const getUserById = (userId) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === userId);
    if (user) {
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      return userWithoutPassword;
    }
    return null;
  };

  // Get user's stats (books shared, requests made, etc.)
  const getUserStats = (userId) => {
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const requests = JSON.parse(localStorage.getItem('requests') || '[]');

    const userBooks = books.filter(b => b.ownerId === userId);
    const sentRequests = requests.filter(r => r.requesterId === userId);
    const receivedRequests = requests.filter(r => r.ownerId === userId);

    return {
      totalBooks: userBooks.length,
      booksAvailable: userBooks.filter(b => b.status === 'available').length,
      requestsSent: sentRequests.length,
      requestsReceived: receivedRequests.length,
      requestsApproved: receivedRequests.filter(r => r.status === 'approved').length,
      swapsCompleted: requests.filter(
        r => (r.requesterId === userId || r.ownerId === userId) && 
             r.status === 'returned' && 
             r.requestType === 'swap'
      ).length
    };
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    getUserById,
    getUserStats,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
