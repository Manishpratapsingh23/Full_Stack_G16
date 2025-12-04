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
  const createRequest = (bookId, bookTitle, ownerId, ownerName, requestType) => {
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
      status: 'pending', // pending, approved, rejected, returned
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

  const value = {
    requests,
    loading,
    createRequest,
    updateRequestStatus,
    getOutgoingRequests,
    getIncomingRequests,
    getRequestById,
    getRequestsByBookId,
    hasPendingRequest,
    deleteRequest,
    refreshRequests: loadRequests
  };

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
};
