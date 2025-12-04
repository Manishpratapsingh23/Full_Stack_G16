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

  // Advanced search with multiple criteria
  const advancedSearch = (searchTerm, filters = {}) => {
    let filtered = [...books];

    // Filter by availability status
    if (filters.status) {
      filtered = filtered.filter(book => book.status === filters.status);
    } else {
      // Default: only show available books
      filtered = filtered.filter(book => book.status === 'available');
    }

    // Search by title, author, or genre (general search term)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        (book.description && book.description.toLowerCase().includes(term))
      );
    }

    // Apply specific filters
    if (filters.title) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    if (filters.author) {
      filtered = filtered.filter(book =>
        book.author.toLowerCase().includes(filters.author.toLowerCase())
      );
    }

    if (filters.genre) {
      const genres = Array.isArray(filters.genre) ? filters.genre : [filters.genre];
      filtered = filtered.filter(book =>
        genres.some(g => book.genre.toLowerCase().includes(g.toLowerCase()))
      );
    }

    if (filters.location) {
      filtered = filtered.filter(book =>
        book.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.city) {
      filtered = filtered.filter(book =>
        book.city && book.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.availableFor) {
      filtered = filtered.filter(book =>
        book.availableFor === filters.availableFor
      );
    }

    // Sort results
    if (filters.sortBy) {
      filtered = sortBooks(filtered, filters.sortBy);
    }

    return filtered;
  };

  // Sort books by different criteria
  const sortBooks = (booksToSort, sortBy) => {
    const sorted = [...booksToSort];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'author-asc':
        return sorted.sort((a, b) => a.author.localeCompare(b.author));
      case 'author-desc':
        return sorted.sort((a, b) => b.author.localeCompare(a.author));
      default:
        return sorted;
    }
  };

  // Get available genres
  const getAvailableGenres = () => {
    const genres = new Set();
    books.forEach(book => {
      if (book.genre) {
        book.genre.split(',').forEach(g => genres.add(g.trim()));
      }
    });
    return Array.from(genres).sort();
  };

  // Get available locations
  const getAvailableLocations = () => {
    const locations = new Set();
    books.forEach(book => {
      if (book.location) locations.add(book.location);
      if (book.city) locations.add(book.city);
    });
    return Array.from(locations).sort();
  };

  // Get books by specific criteria
  const getBooksByCriteria = (criteria) => {
    return books.filter(book => {
      let matches = true;
      
      if (criteria.genre && book.genre !== criteria.genre) matches = false;
      if (criteria.author && book.author !== criteria.author) matches = false;
      if (criteria.owner && book.ownerId !== criteria.owner) matches = false;
      if (criteria.status && book.status !== criteria.status) matches = false;
      if (criteria.availableFor && book.availableFor !== criteria.availableFor) matches = false;
      
      return matches;
    });
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
    advancedSearch,
    sortBooks,
    getAvailableGenres,
    getAvailableLocations,
    getBooksByCriteria,
    updateBookStatus,
    refreshBooks: loadBooks
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};
