import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BookContext = createContext();

// Hook to use BookContext in components
export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within BookProvider');
  }
  return context;
};

export const BookProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load books from localStorage on mount
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    }
    setLoading(false);
  };

  // Save books to localStorage whenever books state changes
  const saveBooks = (updatedBooks) => {
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    setBooks(updatedBooks);
  };

  // Add a new book (user only adds their own books)
  const addBook = (bookData) => {
    if (!currentUser) {
      return { success: false, message: 'You must be logged in to add a book' };
    }

    const newBook = {
      id: Date.now().toString(),
      ...bookData,
      ownerId: currentUser.id,
      ownerName: currentUser.name || currentUser.email,
      status: 'available', // available, borrowed, reserved
      createdAt: new Date().toISOString()
    };

    const updatedBooks = [...books, newBook];
    saveBooks(updatedBooks);
    
    return { success: true, book: newBook };
  };

  // Update a book (only owner can update)
  const updateBook = (bookId, updates) => {
    if (!currentUser) {
      return { success: false, message: 'You must be logged in' };
    }

    const bookIndex = books.findIndex(b => b.id === bookId);
    
    if (bookIndex === -1) {
      return { success: false, message: 'Book not found' };
    }

    if (books[bookIndex].ownerId !== currentUser.id) {
      return { success: false, message: 'You can only edit your own books' };
    }

    const updatedBooks = [...books];
    updatedBooks[bookIndex] = { ...updatedBooks[bookIndex], ...updates };
    saveBooks(updatedBooks);
    
    return { success: true, book: updatedBooks[bookIndex] };
  };

  // Delete a book (only owner can delete)
  const deleteBook = (bookId) => {
    if (!currentUser) {
      return { success: false, message: 'You must be logged in' };
    }

    const book = books.find(b => b.id === bookId);
    
    if (!book) {
      return { success: false, message: 'Book not found' };
    }

    if (book.ownerId !== currentUser.id) {
      return { success: false, message: 'You can only delete your own books' };
    }

    const updatedBooks = books.filter(b => b.id !== bookId);
    saveBooks(updatedBooks);
    
    return { success: true };
  };

  // Get all books (for Home page)
  const getAllBooks = () => {
    return books.filter(book => book.status === 'available');
  };

  // Get user's library (My Library page)
  const getUserBooks = (userId) => {
    if (!userId && currentUser) {
      userId = currentUser.id;
    }
    return books.filter(book => book.ownerId === userId);
  };

  // Get a single book by ID
  const getBookById = (bookId) => {
    return books.find(book => book.id === bookId);
  };

  // Search and filter books
  const searchBooks = (filters) => {
    let filtered = [...books];

    // Filter by availability
    filtered = filtered.filter(book => book.status === 'available');

    // Search by title
    if (filters.title) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    // Filter by author
    if (filters.author) {
      filtered = filtered.filter(book =>
        book.author.toLowerCase().includes(filters.author.toLowerCase())
      );
    }

    // Filter by genre
    if (filters.genre) {
      filtered = filtered.filter(book =>
        book.genre.toLowerCase().includes(filters.genre.toLowerCase())
      );
    }

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(book =>
        book.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by availableFor (lend, swap, donate)
    if (filters.availableFor) {
      filtered = filtered.filter(book =>
        book.availableFor === filters.availableFor
      );
    }

    return filtered;
  };

  // Update book status (for request management)
  const updateBookStatus = (bookId, status) => {
    const bookIndex = books.findIndex(b => b.id === bookId);
    
    if (bookIndex === -1) {
      return { success: false, message: 'Book not found' };
    }

    const updatedBooks = [...books];
    updatedBooks[bookIndex] = { ...updatedBooks[bookIndex], status };
    saveBooks(updatedBooks);
    
    return { success: true };
  };

  const value = {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    getAllBooks,
    getUserBooks,
    getBookById,
    searchBooks,
    updateBookStatus,
    refreshBooks: loadBooks
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};
