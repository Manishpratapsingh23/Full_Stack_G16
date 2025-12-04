import { Link } from 'react-router-dom';

/**
 * BookCard Component
 * Displays a book's information in a card format
 * Used in Home page and MyLibrary page
 */
const BookCard = ({ book, showActions = false, onEdit, onDelete }) => {
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

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Available</span>;
      case 'borrowed':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Borrowed</span>;
      case 'reserved':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Reserved</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Card Header with Status Badge */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
            {book.title}
          </h3>
          {getStatusBadge(book.status)}
        </div>
        <p className="text-sm text-gray-600">by {book.author}</p>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span className="font-medium">Genre:</span>
          <span className="ml-1">{book.genre}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">Location:</span>
          <span className="ml-1">{book.location}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="font-medium">Owner:</span>
          <span className="ml-1">{book.ownerName}</span>
        </div>

        {/* Available For Badge */}
        <div className="pt-2">
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getBadgeColor(book.availableFor)}`}>
            Available for: {book.availableFor}
          </span>
        </div>
      </div>

      {/* Card Footer with Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        {showActions ? (
          // Owner actions (Edit/Delete)
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(book)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(book.id)}
              className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        ) : (
          // View Details button
          <Link
            to={`/book/${book.id}`}
            className="block w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium text-center rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default BookCard;
