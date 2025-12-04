import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';

/**
 * Requests Page
 * Displays outgoing requests made by the user
 * Shows request status and allows marking as returned
 */
const Requests = () => {
  const { currentUser } = useAuth();
  const { getOutgoingRequests, updateRequestStatus, deleteRequest } = useRequests();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected, returned
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load requests on component mount
  useEffect(() => {
    if (currentUser) {
      loadRequests();
    }
  }, [currentUser]);

  // Apply filter whenever requests or filter changes
  useEffect(() => {
    applyFilter();
  }, [requests, filter]);

  const loadRequests = () => {
    const userRequests = getOutgoingRequests();
    setRequests(userRequests);
  };

  const applyFilter = () => {
    if (filter === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(req => req.status === filter));
    }
  };

  // Handle marking request as returned
  const handleMarkReturned = (requestId) => {
    if (window.confirm('Confirm that you have returned this book?')) {
      const result = updateRequestStatus(requestId, 'returned');
      if (result.success) {
        loadRequests();
        setSuccessMessage('Request marked as returned successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(result.message);
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

  // Handle deleting a pending request
  const handleDeleteRequest = (requestId) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      const result = deleteRequest(requestId);
      if (result.success) {
        loadRequests();
        setSuccessMessage('Request cancelled successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(result.message);
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Rejected
          </span>
        );
      case 'returned':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Returned
          </span>
        );
      default:
        return null;
    }
  };

  // Get request type badge
  const getRequestTypeBadge = (type) => {
    return type === 'borrow' ? (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">
        Borrow
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700">
        Swap
      </span>
    );
  };

  // Get stats for each status
  const stats = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    returned: requests.filter(r => r.status === 'returned').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
        <p className="text-gray-600 mt-1">Track your borrow and swap requests</p>
      </div>

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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            filter === 'all'
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-gray-900">{stats.all}</p>
          <p className="text-sm text-gray-600">All Requests</p>
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            filter === 'pending'
              ? 'border-yellow-500 bg-yellow-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            filter === 'approved'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-sm text-gray-600">Approved</p>
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            filter === 'rejected'
              ? 'border-red-500 bg-red-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-sm text-gray-600">Rejected</p>
        </button>
        <button
          onClick={() => setFilter('returned')}
          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            filter === 'returned'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-blue-600">{stats.returned}</p>
          <p className="text-sm text-gray-600">Returned</p>
        </button>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-16 px-4">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No requests yet' : `No ${filter} requests`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Start by browsing books and making your first request!' 
                : `You don't have any ${filter} requests at the moment.`}
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Request Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Link
                            to={`/book/${request.bookId}`}
                            className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-150"
                          >
                            {request.bookTitle}
                          </Link>
                          {getRequestTypeBadge(request.requestType)}
                        </div>
                        <p className="text-sm text-gray-600">
                          Owner: <span className="font-medium">{request.ownerName}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Requested on {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      {getStatusBadge(request.status)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {request.status === 'approved' && (
                        <button
                          onClick={() => handleMarkReturned(request.id)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          Mark Returned
                        </button>
                      )}
                      {request.status === 'pending' && (
                        <button
                          onClick={() => handleDeleteRequest(request.id)}
                          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      )}
                      <Link
                        to={`/book/${request.bookId}`}
                        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        View Book
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Request Status Guide</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="font-semibold mr-2">Pending:</span>
            <span>Your request is waiting for the owner's response. You can cancel it anytime.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">Approved:</span>
            <span>The owner has approved your request! Contact them to arrange pickup. Mark as returned when done.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">Rejected:</span>
            <span>The owner has declined your request. You can try requesting other books.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">Returned:</span>
            <span>You have marked the book as returned. The transaction is complete.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Requests;
