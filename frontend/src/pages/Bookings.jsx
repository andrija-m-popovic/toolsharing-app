import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingCard } from '../components/BookingCard';
import { ReviewModal } from '../components/ReviewModal';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, MessageCircle } from 'lucide-react';

export const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeTab !== 'all') {
        params.append('type', activeTab);
      }

      const response = await fetch(`http://localhost:5000/api/bookings?${params}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchBookings(); // Refresh bookings
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update booking status');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const handleMessage = (booking) => {
    // TODO: Implement messaging functionality
    console.log('Message booking:', booking);
  };

  const handleReview = (booking) => {
    setSelectedBooking(booking);
    setReviewModalOpen(true);
  };

  const handleReviewSuccess = () => {
    fetchBookings(); // Refresh bookings
  };

  const filterBookings = (bookings, type) => {
    switch (type) {
      case 'borrower':
        return bookings.filter(b => b.borrower_id === user?.id);
      case 'lender':
        return bookings.filter(b => b.lender_id === user?.id);
      default:
        return bookings;
    }
  };

  const getBookingStats = () => {
    const borrowerBookings = bookings.filter(b => b.borrower_id === user?.id);
    const lenderBookings = bookings.filter(b => b.lender_id === user?.id);
    
    return {
      totalBorrowed: borrowerBookings.length,
      totalLent: lenderBookings.length,
      pendingRequests: lenderBookings.filter(b => b.status === 'pending').length,
      activeRentals: bookings.filter(b => b.status === 'active').length
    };
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Please log in to view your bookings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = getBookingStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">
            Manage your tool rentals and lending history
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalBorrowed}</div>
              <div className="text-sm text-gray-600">Tools Borrowed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalLent}</div>
              <div className="text-sm text-gray-600">Tools Lent</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</div>
              <div className="text-sm text-gray-600">Pending Requests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.activeRentals}</div>
              <div className="text-sm text-gray-600">Active Rentals</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="borrower">My Rentals</TabsTrigger>
            <TabsTrigger value="lender">My Lending</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : bookings.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600">Start browsing tools to make your first booking!</p>
                </div>
              ) : (
                bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    userRole={booking.borrower_id === user.id ? 'borrower' : 'lender'}
                    onStatusUpdate={handleStatusUpdate}
                    onMessage={handleMessage}
                    onReview={handleReview}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="borrower" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterBookings(bookings, 'borrower').map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userRole="borrower"
                  onStatusUpdate={handleStatusUpdate}
                  onMessage={handleMessage}
                  onReview={handleReview}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lender" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterBookings(bookings, 'lender').map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userRole="lender"
                  onStatusUpdate={handleStatusUpdate}
                  onMessage={handleMessage}
                  onReview={handleReview}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Review Modal */}
        {selectedBooking && (
          <ReviewModal
            booking={selectedBooking}
            open={reviewModalOpen}
            onClose={() => {
              setReviewModalOpen(false);
              setSelectedBooking(null);
            }}
            onSuccess={handleReviewSuccess}
          />
        )}
      </div>
    </div>
  );
};