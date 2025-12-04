import { useState, useEffect } from 'react';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';

/**
 * Home Page
 * Displays all available books with search and filter functionality
 * Users can search by title, author, genre, and location
 */
const Home = () => {
  const { getAllBooks, searchBooks } = useBooks();
  const { currentUser } = useAuth();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    genre: '',
    location: '',
    availableFor: ''
  });
  const [isSearching, setIsSearching] = useState(false);

  // Load all available books on component mount
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    const allBooks = getAllBooks();
    // Exclude current user's books from the home page
    const otherUsersBooks = currentUser 
      ? allBooks.filter(book => book.ownerId !== currentUser.id)
      : allBooks;
    setBooks(otherUsersBooks);
    setFilteredBooks(otherUsersBooks);
  };

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);

    // Check if any filter is active
    const hasActiveFilters = Object.values(filters).some(val => val.trim() !== '');

    if (!hasActiveFilters) {
      // No filters, show all books
      setFilteredBooks(books);
    } else {
      // Apply filters
      const results = searchBooks(filters);
      // Exclude current user's books
      const otherUsersBooks = currentUser 
        ? results.filter(book => book.ownerId !== currentUser.id)
        : results;
      setFilteredBooks(otherUsersBooks);
    }

    setIsSearching(false);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      title: '',
      author: '',
      genre: '',
      location: '',
      availableFor: ''
    });
    setFilteredBooks(books);
  };

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some(val => val.trim() !== '');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Discover Books</h1>
        <p className="text-gray-600 mt-1">Find books to borrow, swap, or receive as donations</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Search & Filter</h2>
        <form onSubmit={handleSearch} className="space-y-4">
          {/* First Row: Title and Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Book Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={filters.title}
                onChange={handleFilterChange}
                placeholder="Search by title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={filters.author}
                onChange={handleFilterChange}
                placeholder="Search by author..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Second Row: Genre and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={filters.genre}
                onChange={handleFilterChange}
                placeholder="Search by genre..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Search by location..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Third Row: Available For */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="availableFor" className="block text-sm font-medium text-gray-700 mb-1">
                Available For
              </label>
              <select
                id="availableFor"
                name="availableFor"
                value={filters.availableFor}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="lend">Lend</option>
                <option value="swap">Swap</option>
                <option value="donate">Donate</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSearching}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {isSearching ? 'Searching...' : 'Search'}
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div>
        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {hasActiveFilters ? 'Search Results' : 'All Available Books'}
          </h2>
          <span className="text-sm text-gray-600">
            {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
          </span>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {hasActiveFilters ? 'No books match your search' : 'No books available yet'}
            </h3>
            <p className="text-gray-600">
              {hasActiveFilters 
                ? 'Try adjusting your filters or clearing them to see all books.' 
                : 'Be the first to add a book to the library!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} showActions={false} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {books.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Library Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-indigo-600">{books.length}</p>
              <p className="text-sm text-gray-600 mt-1">Total Books</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">
                {books.filter(b => b.availableFor === 'lend').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">For Lending</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-600">
                {books.filter(b => b.availableFor === 'swap').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">For Swapping</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">
                {books.filter(b => b.availableFor === 'donate').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">For Donation</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
