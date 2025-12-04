import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const RequestContext = createContext();

// Hook to use RequestContext in components
export const useRequests = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequests must be used within RequestProvider');
  }
  return context;
};

export const RequestProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { notifyRequestSent, notifyRequestApproved, notifyRequestRejected, notifyBookReturned } = useNotifications();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load requests from localStorage on mount
  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const storedRequests = localStorage.getItem('requests');
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    }
    setLoading(false);
  };

  // Save requests to localStorage
  const saveRequests = (updatedRequests) => {
    localStorage.setItem('requests', JSON.stringify(updatedRequests));
    setRequests(updatedRequests);
  };

  // Create a new request (borrow or swap)
  const createRequest = (bookId, bookTitle, ownerId, ownerName, requestType, dueDate = null) => {
    if (!currentUser) {
      return { success: false, message: 'You must be logged in to make a request' };
    }

    if (currentUser.id === ownerId) {
      return { success: false, message: 'You cannot request your own book' };
    }

    // Check if user already has a pending request for this book
    const existingRequest = requests.find(
      r => r.bookId === bookId && 
           r.requesterId === currentUser.id && 
           r.status === 'pending'
    );

    if (existingRequest) {
      return { success: false, message: 'You already have a pending request for this book' };
    }

    // Calculate due date if not provided (30 days from approval)
    let calculatedDueDate = dueDate;
    if (!calculatedDueDate && requestType === 'borrow') {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      calculatedDueDate = date.toISOString();
    }

    const newRequest = {
      id: Date.now().toString(),
      bookId,
      bookTitle,
      ownerId,
      ownerName,
      requesterId: currentUser.id,
      requesterName: currentUser.name || currentUser.email,
      requesterEmail: currentUser.email,
      requestType, // 'borrow' or 'swap'
      status: 'pending', // pending, approved, rejected, returned, overdue
      dueDate: calculatedDueDate,
      approvedAt: null,
      returnedAt: null,
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedRequests = [...requests, newRequest];
    saveRequests(updatedRequests);

    // Send notification to book owner
    notifyRequestSent(ownerId, newRequest.requesterName, bookTitle, requestType);

    return { success: true, request: newRequest };
  };

  // Update request status (for owners: approve/reject, for requesters: mark as returned)
  const updateRequestStatus = (requestId, newStatus) => {
    if (!currentUser) {
      return { success: false, message: 'You must be logged in' };
    }

    const requestIndex = requests.findIndex(r => r.id === requestId);
    
    if (requestIndex === -1) {
      return { success: false, message: 'Request not found' };
    }

    const request = requests[requestIndex];

    // Check permissions
    if (newStatus === 'returned' && request.requesterId !== currentUser.id) {
      return { success: false, message: 'Only the requester can mark as returned' };
    }

    if ((newStatus === 'approved' || newStatus === 'rejected') && request.ownerId !== currentUser.id) {
      return { success: false, message: 'Only the owner can approve or reject requests' };
    }

    const updatedRequests = [...requests];
    updatedRequests[requestIndex] = {
      ...request,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    saveRequests(updatedRequests);

    // Send appropriate notification
    if (newStatus === 'approved') {
      notifyRequestApproved(request.requesterId, request.bookTitle, request.requestType);
    } else if (newStatus === 'rejected') {
      notifyRequestRejected(request.requesterId, request.bookTitle, request.requestType);
    } else if (newStatus === 'returned') {
      notifyBookReturned(request.ownerId, request.requesterName, request.bookTitle);
    }

    return { success: true, request: updatedRequests[requestIndex] };
  };

  // Get outgoing requests (requests made by current user)
  const getOutgoingRequests = () => {
    if (!currentUser) return [];
    return requests
      .filter(r => r.requesterId === currentUser.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // Get incoming requests (requests for current user's books)
  const getIncomingRequests = () => {
    if (!currentUser) return [];
    return requests
      .filter(r => r.ownerId === currentUser.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // Get request by ID
  const getRequestById = (requestId) => {
    return requests.find(r => r.id === requestId);
  };

  // Get requests by book ID
  const getRequestsByBookId = (bookId) => {
    return requests.filter(r => r.bookId === bookId);
  };

  // Check if user has pending request for a book
  const hasPendingRequest = (bookId) => {
    if (!currentUser) return false;
    return requests.some(
      r => r.bookId === bookId && 
           r.requesterId === currentUser.id && 
           r.status === 'pending'
    );
  };

  // Delete a request (only if pending and user is requester)
  const deleteRequest = (requestId) => {
    if (!currentUser) {
      return { success: false, message: 'You must be logged in' };
    }

    const request = requests.find(r => r.id === requestId);
    
    if (!request) {
      return { success: false, message: 'Request not found' };
    }

    if (request.requesterId !== currentUser.id) {
      return { success: false, message: 'You can only delete your own requests' };
    }

    if (request.status !== 'pending') {
      return { success: false, message: 'You can only delete pending requests' };
    }

    const updatedRequests = requests.filter(r => r.id !== requestId);
    saveRequests(updatedRequests);

    return { success: true };
  };

  // Add notes to a request
  const updateRequestNotes = (requestId, notes) => {
    const requestIndex = requests.findIndex(r => r.id === requestId);
    
    if (requestIndex === -1) {
      return { success: false, message: 'Request not found' };
    }

    const updatedRequests = [...requests];
    updatedRequests[requestIndex] = {
      ...updatedRequests[requestIndex],
      notes,
      updatedAt: new Date().toISOString()
    };
    saveRequests(updatedRequests);

    return { success: true, request: updatedRequests[requestIndex] };
  };

  // Set or update due date for a request
  const updateDueDate = (requestId, dueDate) => {
    const requestIndex = requests.findIndex(r => r.id === requestId);
    
    if (requestIndex === -1) {
      return { success: false, message: 'Request not found' };
    }

    const updatedRequests = [...requests];
    updatedRequests[requestIndex] = {
      ...updatedRequests[requestIndex],
      dueDate,
      updatedAt: new Date().toISOString()
    };
    saveRequests(updatedRequests);

    return { success: true, request: updatedRequests[requestIndex] };
  };

  // Check if a request is overdue
  const isRequestOverdue = (request) => {
    if (!request.dueDate || request.status !== 'approved') {
      return false;
    }
    
    const dueDate = new Date(request.dueDate);
    const today = new Date();
    return today > dueDate;
  };

  // Get overdue requests for current user
  const getOverdueRequests = () => {
    if (!currentUser) return [];
    
    return requests.filter(r => 
      (r.requesterId === currentUser.id || r.ownerId === currentUser.id) &&
      isRequestOverdue(r)
    );
  };

  // Get requests due soon (within 7 days)
  const getRequestsDueSoon = () => {
    if (!currentUser) return [];
    
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    return requests.filter(r => {
      if (!r.dueDate || r.status !== 'approved') {
        return false;
      }

      const dueDate = new Date(r.dueDate);
      return r.requesterId === currentUser.id && 
             dueDate > today && 
             dueDate <= nextWeek &&
             !isRequestOverdue(r);
    });
  };

  // Get requests by status
  const getRequestsByStatus = (status) => {
    return requests.filter(r => r.status === status);
  };

  // Get active borrowed books for current user
  const getActiveBorrowedBooks = () => {
    if (!currentUser) return [];
    
    return requests.filter(r =>
      r.requesterId === currentUser.id &&
      r.requestType === 'borrow' &&
      r.status === 'approved' &&
      !r.returnedAt
    );
  };

  // Get active lent books for current user
  const getActiveLentBooks = () => {
    if (!currentUser) return [];
    
    return requests.filter(r =>
      r.ownerId === currentUser.id &&
      r.requestType === 'borrow' &&
      r.status === 'approved' &&
      !r.returnedAt
    );
  };

  const value = {
    requests,
    loading,
    createRequest,
    updateRequestStatus,
    updateRequestNotes,
    updateDueDate,
    getOutgoingRequests,
    getIncomingRequests,
    getRequestById,
    getRequestsByBookId,
    getRequestsByStatus,
    hasPendingRequest,
    deleteRequest,
    isRequestOverdue,
    getOverdueRequests,
    getRequestsDueSoon,
    getActiveBorrowedBooks,
    getActiveLentBooks,
    refreshRequests: loadRequests
  };

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
};
