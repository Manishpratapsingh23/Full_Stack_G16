import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';

/**
 * BookDetails Page
 * Displays detailed information about a specific book
 * Allows users to request to borrow or swap books (if not the owner)
 */
const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getBookById } = useBooks();
  const { createRequest, hasPendingRequest } = useRequests();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestType, setRequestType] = useState('borrow');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [hasPending, setHasPending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load book details on component mount
  useEffect(() => {
    if (id) {
      const bookData = getBookById(id);
      if (bookData) {
        setBook(bookData);
        // Check if user already has a pending request for this book
        if (currentUser) {
          setHasPending(hasPendingRequest(id));
        }
      } else {
        setErrorMessage('Book not found');
      }
      setLoading(false);
    }
  }, [id, currentUser]);

  // Handle request submission
  const handleSubmitRequest = () => {
    if (!currentUser) {
      setErrorMessage('You must be logged in to make a request');
      setShowRequestModal(false);
      return;
    }

    const result = createRequest(
      book.id,
      book.title,
      book.ownerId,
      book.ownerName,
      requestType
    );

    if (result.success) {
      setSuccessMessage(`${requestType === 'borrow' ? 'Borrow' : 'Swap'} request sent successfully!`);
      setHasPending(true);
      setShowRequestModal(false);
      setTimeout(() => setSuccessMessage(''), 5000);
    } else {
      setErrorMessage(result.message);
      setShowRequestModal(false);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  // Get badge color based on availableFor type
  const getBadgeColor = (type) => {
    switch (type) {
      case 'lend':
        return 'bg-blue-100 text-blue-800';
      case 'swap':
        return 'bg-green-100 text-green-800';
      case 'donate':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Available
          </span>
        );
      case 'borrowed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Borrowed
          </span>
        );
      case 'reserved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Reserved
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-16">
        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h2>
        <p className="text-gray-600 mb-6">The book you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    );
  }

  const isOwner = currentUser && currentUser.id === book.ownerId;
  const canRequest = currentUser && !isOwner && book.status === 'available' && !hasPending;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Book Details Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-indigo-100">by {book.author}</p>
            </div>
            {getStatusBadge(book.status)}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getBadgeColor(book.availableFor)}`}>
              Available for: {book.availableFor}
            </span>
            {isOwner && (
              <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-white text-indigo-600">
                Your Book
              </span>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Genre */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Genre</h3>
                <p className="text-lg font-semibold text-gray-900">{book.genre}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="text-lg font-semibold text-gray-900">{book.location}</p>
              </div>
            </div>

            {/* Owner */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Owner</h3>
                <p className="text-lg font-semibold text-gray-900">{book.ownerName}</p>
              </div>
            </div>

            {/* Added Date */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Added On</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(book.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {book.description && (
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-6 border-t border-gray-200">
            {!currentUser ? (
              <div className="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800 mb-4">You must be logged in to request this book</p>
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Login to Continue
                </Link>
              </div>
            ) : isOwner ? (
              <div className="text-center bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-800 mb-4">This is your book</p>
                <Link
                  to="/my-library"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Go to My Library
                </Link>
              </div>
            ) : hasPending ? (
              <div className="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800 mb-4">You already have a pending request for this book</p>
                <Link
                  to="/requests"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  View My Requests
                </Link>
              </div>
            ) : book.status !== 'available' ? (
              <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800">This book is currently not available</p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    setRequestType('borrow');
                    setShowRequestModal(true);
                  }}
                  className="flex-1 flex items-center justify-center px-6 py-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Request to Borrow
                </button>
                <button
                  onClick={() => {
                    setRequestType('swap');
                    setShowRequestModal(true);
                  }}
                  className="flex-1 flex items-center justify-center px-6 py-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Request to Swap
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Request Confirmation Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirm {requestType === 'borrow' ? 'Borrow' : 'Swap'} Request
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to request to {requestType} "{book.title}" from {book.ownerName}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
