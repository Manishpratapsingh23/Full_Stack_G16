/**
 * QUICK START EXAMPLES
 * Copy these examples into your actual component files
 */

// ============================================
// EXAMPLE 1: Setup in App.jsx
// ============================================
import Layout from './components/Layout';
import NotificationListener from './components/NotificationListener';
import { NotificationProvider } from './context/NotificationContext';

export default function App() {
  return (
    <NotificationProvider>
      {/* Important: Add NotificationListener to capture real-time notifications */}
      <NotificationListener />
      <Layout />
    </NotificationProvider>
  );
}

// ============================================
// EXAMPLE 2: Add Bell to Header/Navigation
// ============================================
import NotificationBell from './components/NotificationBell';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">📚 Book Swap</h1>

        <nav className="flex items-center gap-4">
          <a href="/home">Home</a>
          <a href="/my-library">My Library</a>
          <a href="/requests">Requests</a>

          {/* Add notification bell here */}
          <NotificationBell />
        </nav>
      </div>
    </header>
  );
}

// ============================================
// EXAMPLE 3: Send Request & Trigger Notification
// ============================================
import axios from 'axios';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function RequestBook({ bookId, ownerId, bookTitle }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRequestBorrow = async () => {
    setLoading(true);
    try {
      // Step 1: Create request in database
      const requestResponse = await axios.post('/api/requests', {
        bookId,
        ownerId,
        requesterId: currentUser.id,
        requestType: 'borrow',
        status: 'pending',
      });

      if (!requestResponse.data.success) {
        throw new Error('Failed to create request');
      }

      // Step 2: Send real-time notification to owner
      const notificationResponse = await axios.post(
        'http://localhost:5000/api/notifications/trigger/request-received',
        {
          ownerId,
          requesterName: currentUser.name,
          bookTitle,
          requestType: 'borrow',
          requestId: requestResponse.data.requestId,
        }
      );

      if (notificationResponse.data.success) {
        alert('✅ Request sent! The owner will be notified.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRequestBorrow}
      disabled={loading}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? '⏳ Sending Request...' : '📬 Request to Borrow'}
    </button>
  );
}

// ============================================
// EXAMPLE 4: Approve Request & Send Notification
// ============================================

export default function RequestApprovalButton({ request, onApproved }) {
  const [loading, setLoading] = useState(false);

  const handleApproveRequest = async () => {
    setLoading(true);
    try {
      // Step 1: Update request status in database
      await axios.put(`/api/requests/${request.id}`, {
        status: 'approved',
        approvedDate: new Date().toISOString(),
      });

      // Step 2: Send approval notification to requester
      await axios.post(
        'http://localhost:5000/api/notifications/trigger/approved',
        {
          requesterId: request.requesterId,
          bookTitle: request.bookTitle,
          requestType: request.requestType,
          requestId: request.id,
        }
      );

      alert('✅ Request approved!');
      onApproved?.();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to approve request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleApproveRequest}
      disabled={loading}
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? '⏳ Approving...' : '✅ Approve'}
    </button>
  );
}

// ============================================
// EXAMPLE 5: Reject Request & Send Notification
// ============================================
export default function RequestRejectionButton({ request, onRejected }) {
  const [loading, setLoading] = useState(false);

  const handleRejectRequest = async () => {
    setLoading(true);
    try {
      // Step 1: Update request status
      await axios.put(`/api/requests/${request.id}`, {
        status: 'rejected',
        rejectedDate: new Date().toISOString(),
      });

      // Step 2: Send rejection notification
      await axios.post(
        'http://localhost:5000/api/notifications/trigger/rejected',
        {
          requesterId: request.requesterId,
          bookTitle: request.bookTitle,
          requestType: request.requestType,
          requestId: request.id,
        }
      );

      alert('❌ Request rejected');
      onRejected?.();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRejectRequest}
      disabled={loading}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? '⏳ Rejecting...' : '❌ Reject'}
    </button>
  );
}

// ============================================
// EXAMPLE 6: Mark Book as Returned
// ============================================
export default function MarkReturnedButton({ request, onReturned }) {
  const [loading, setLoading] = useState(false);

  const handleMarkReturned = async () => {
    setLoading(true);
    try {
      // Step 1: Update request status
      await axios.put(`/api/requests/${request.id}`, {
        status: 'returned',
        returnedDate: new Date().toISOString(),
      });

      // Step 2: Notify the owner that book was returned
      await axios.post(
        'http://localhost:5000/api/notifications/trigger/returned',
        {
          ownerId: request.ownerId,
          returnerName: request.requesterName,
          bookTitle: request.bookTitle,
          requestId: request.id,
        }
      );

      alert('✅ Book marked as returned!');
      onReturned?.();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to mark as returned');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMarkReturned}
      disabled={loading}
      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
    >
      {loading ? '⏳ Processing...' : '📚 Mark Returned'}
    </button>
  );
}

// ============================================
// EXAMPLE 7: Use Notifications Hook
// ============================================
import { useNotifications } from '../context/NotificationContext';

export default function NotificationSummary() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
  } = useNotifications();

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        Notifications ({unreadCount} unread)
      </h2>

      <div className="space-y-2">
        {notifications.slice(0, 5).map((notification) => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg ${
              notification.read ? 'bg-gray-100' : 'bg-blue-50'
            }`}
          >
            <p className="font-semibold">{notification.message}</p>
            <p className="text-sm text-gray-600">
              {new Date(notification.createdAt).toLocaleString()}
            </p>

            <div className="flex gap-2 mt-2">
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => deleteNotification(notification.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {unreadCount > 0 && (
        <button
          onClick={markAllAsRead}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Mark All as Read
        </button>
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 8: Full Requests Page with Notifications
// ============================================
import { useEffect } from 'react';
import RequestApprovalButton from './RequestApprovalButton';
import RequestRejectionButton from './RequestRejectionButton';

export default function RequestsPage() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [currentUser?.id]);

  const fetchRequests = async () => {
    if (!currentUser?.id) return;

    setLoading(true);
    try {
      const response = await axios.get(`/api/requests?ownerId=${currentUser.id}`);
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproved = () => {
    fetchRequests(); // Refresh list
  };

  if (loading) return <p>Loading requests...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📋 Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-600">No pending requests</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {request.bookTitle}
                  </h3>
                  <p className="text-gray-600">
                    Requested by: {request.requesterName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Type: {request.requestType}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: <span className="font-semibold">{request.status}</span>
                  </p>
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <RequestApprovalButton
                      request={request}
                      onApproved={handleApproved}
                    />
                    <RequestRejectionButton
                      request={request}
                      onApproved={handleApproved}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// EXPORT SUMMARY
// ============================================
/**
 * Use these components and patterns in your application:
 *
 * 1. Wrap App with NotificationProvider
 * 2. Add NotificationListener component
 * 3. Add NotificationBell to header
 * 4. Call notification trigger endpoints when:
 *    - Request is created → /api/notifications/trigger/request-received
 *    - Request approved → /api/notifications/trigger/approved
 *    - Request rejected → /api/notifications/trigger/rejected
 *    - Book returned → /api/notifications/trigger/returned
 *    - Due date approaching → /api/notifications/trigger/due-date
 *
 * The system will automatically:
 * - Send real-time WebSocket notifications
 * - Display toast alerts
 * - Send emails (if configured)
 * - Update notification badge count
 * - Show browser notifications (if permitted)
 */
