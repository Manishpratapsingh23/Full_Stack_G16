import { useState, useEffect } from 'react';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';

/**
 * Home Page
 * Displays all available books with advanced search and filter functionality
 * Users can search by title, author, genre, location, and availability type
 * Includes sorting options and advanced filters
 */
const Home = () => {
  const { getAllBooks, advancedSearch, getAvailableGenres, getAvailableLocations } = useBooks();
  const { currentUser } = useAuth();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    genre: '',
    location: '',
    availableFor: '',
    status: 'available',
    sortBy: 'newest'
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);

  // Load all available books on component mount
  const loadBooks = () => {
    const allBooks = getAllBooks();
    // Exclude current user's books from the home page
    const otherUsersBooks = currentUser 
      ? allBooks.filter(book => book.ownerId !== currentUser.id)
      : allBooks;
    setBooks(otherUsersBooks);
    setFilteredBooks(otherUsersBooks);
    
    // Load available genres and locations
    setAvailableGenres(getAvailableGenres());
    setAvailableLocations(getAvailableLocations());
  };

  useEffect(() => {
    loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply search and filters
  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);

    // Build filter object for advanced search
    const advancedFilters = {
      title: filters.title,
      author: filters.author,
      genre: filters.genre,
      location: filters.location,
      availableFor: filters.availableFor,
      status: filters.status,
      sortBy: filters.sortBy
    };

    // Use advanced search
    const results = advancedSearch(searchTerm, advancedFilters);
    
    // Exclude current user's books
    const otherUsersBooks = currentUser 
      ? results.filter(book => book.ownerId !== currentUser.id)
      : results;
    
    setFilteredBooks(otherUsersBooks);
    setIsSearching(false);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      title: '',
      author: '',
      genre: '',
      location: '',
      availableFor: '',
      status: 'available',
      sortBy: 'newest'
    });
    setFilteredBooks(books);
    setShowAdvancedFilters(false);
  };

  // Check if any filter is active
  const hasActiveFilters = searchTerm.trim() !== '' || 
                          Object.entries(filters).some(([key, val]) => {
                            if (key === 'status' || key === 'sortBy') return false;
                            return val.trim() !== '';
                          });

  return (
    <div className="space-y-6">
      {/* User Dashboard Section - Show when logged in */}
      {currentUser && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {currentUser.name}!</h1>
              <p className="text-indigo-100 text-lg mb-4">Here's your BookSwap dashboard overview</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <p className="text-indigo-100 text-sm">Total Books Shared</p>
                  <p className="text-3xl font-bold mt-2">{books.length}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <p className="text-indigo-100 text-sm">Available Books</p>
                  <p className="text-3xl font-bold mt-2">{filteredBooks.length}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <p className="text-indigo-100 text-sm">Member Since</p>
                  <p className="text-lg font-bold mt-2">{new Date(currentUser.createdAt || Date.now()).getFullYear()}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <p className="text-indigo-100 text-sm">Quick Actions</p>
                  <div className="flex space-x-2 mt-2">
                    <a href="/dashboard" className="bg-white text-indigo-600 px-3 py-1 rounded text-sm font-semibold hover:bg-indigo-50 transition">
                      Dashboard
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <svg className="w-24 h-24 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Discover Books</h1>
        <p className="text-gray-600 mt-1">Find books to borrow, swap, or receive as donations</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Search & Filter</h2>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
          </button>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          {/* Main Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Quick Search
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by title, author, or keywords..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pl-10"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="space-y-4 border-t border-gray-200 pt-4">
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
                    placeholder="Filter by title..."
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
                    placeholder="Filter by author..."
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
                  <select
                    id="genre"
                    name="genre"
                    value={filters.genre}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">All Genres</option>
                    {availableGenres.map(genre => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">All Locations</option>
                    {availableLocations.map(location => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Third Row: Available For and Sorting */}
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
                    <option value="lend">Lending</option>
                    <option value="swap">Swapping</option>
                    <option value="donate">Donation</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    id="sortBy"
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title-asc">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                    <option value="author-asc">Author (A-Z)</option>
                    <option value="author-desc">Author (Z-A)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

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
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-indigo-600">{books.length}</p>
              <p className="text-sm text-gray-600 mt-1">Total Books</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-blue-600">
                {books.filter(b => b.availableFor === 'lend').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">For Lending</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-green-600">
                {books.filter(b => b.availableFor === 'swap').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">For Swapping</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
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
