import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { format, isSameDay, isWithinInterval } from 'date-fns';

export const ToolAvailabilityCalendar = ({ toolId, trigger }) => {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && toolId) {
      fetchBookings();
    }
  }, [open, toolId]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/tools/${toolId}/bookings`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDateBooked = (date) => {
    return bookings.some(booking => {
      const startDate = new Date(booking.start_date);
      const endDate = new Date(booking.end_date);
      return isWithinInterval(date, { start: startDate, end: endDate }) &&
             ['confirmed', 'active'].includes(booking.status);
    });
  };

  const getBookingForDate = (date) => {
    return bookings.find(booking => {
      const startDate = new Date(booking.start_date);
      const endDate = new Date(booking.end_date);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5" />
            <span>Tool Availability Calendar</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                booked: (date) => isDateBooked(date),
              }}
              modifiersStyles={{
                booked: { 
                  backgroundColor: '#fee2e2', 
                  color: '#dc2626',
                  fontWeight: 'bold'
                },
              }}
            />
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span className="text-sm">Booked</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">
              {selectedDate ? `Bookings for ${format(selectedDate, 'PPP')}` : 'Select a date'}
            </h3>
            
            {selectedDate && (
              <div className="space-y-3">
                {(() => {
                  const booking = getBookingForDate(selectedDate);
                  if (booking) {
                    return (
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              €{booking.total_price}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <User className="w-4 h-4 mr-2" />
                              {booking.borrower?.full_name || booking.borrower?.username}
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="w-4 h-4 mr-2" />
                              {format(new Date(booking.start_date), 'PPP')} - {format(new Date(booking.end_date), 'PPP')}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  } else {
                    return (
                      <div className="text-center py-8 text-gray-500">
                        <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>No bookings for this date</p>
                        <p className="text-sm">Tool is available</p>
                      </div>
                    );
                  }
                })()}
              </div>
            )}

            {!selectedDate && bookings.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Upcoming Bookings</h4>
                {bookings
                  .filter(booking => new Date(booking.start_date) > new Date())
                  .slice(0, 3)
                  .map(booking => (
                    <Card key={booking.id}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            €{booking.total_price}
                          </span>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">
                            {booking.borrower?.full_name || booking.borrower?.username}
                          </p>
                          <p className="text-gray-600">
                            {format(new Date(booking.start_date), 'MMM dd')} - {format(new Date(booking.end_date), 'MMM dd')}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};