import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, MessageCircle, Star, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const BookingCard = ({ booking, userRole, onStatusUpdate, onMessage, onReview }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusActions = () => {
    if (userRole === 'lender') {
      switch (booking.status) {
        case 'pending':
          return (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => onStatusUpdate(booking.id, 'confirmed')}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Accept
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => onStatusUpdate(booking.id, 'cancelled')}
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Decline
              </Button>
            </div>
          );
        case 'confirmed':
          return (
            <Button 
              size="sm" 
              onClick={() => onStatusUpdate(booking.id, 'active')}
              className="w-full"
            >
              <Clock className="w-4 h-4 mr-1" />
              Mark as Active
            </Button>
          );
        case 'active':
          return (
            <Button 
              size="sm" 
              onClick={() => onStatusUpdate(booking.id, 'completed')}
              className="w-full"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark as Completed
            </Button>
          );
        default:
          return null;
      }
    } else {
      // Borrower actions
      switch (booking.status) {
        case 'pending':
          return (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onStatusUpdate(booking.id, 'cancelled')}
              className="w-full"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Cancel Request
            </Button>
          );
        case 'completed':
          return (
            <Button 
              size="sm" 
              onClick={() => onReview(booking)}
              className="w-full"
            >
              <Star className="w-4 h-4 mr-1" />
              Leave Review
            </Button>
          );
        default:
          return null;
      }
    }
  };

  const otherUser = userRole === 'lender' ? booking.borrower : booking.lender;
  const startDate = new Date(booking.start_date);
  const endDate = new Date(booking.end_date);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{booking.tool?.name}</CardTitle>
            <p className="text-sm text-gray-600">{booking.tool?.category?.name}</p>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={otherUser?.profile_picture_url} />
            <AvatarFallback>
              {otherUser?.full_name?.charAt(0) || otherUser?.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">
              {userRole === 'lender' ? 'Borrower' : 'Owner'}: {otherUser?.full_name || otherUser?.username}
            </p>
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1" />
              {otherUser?.location}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center text-gray-600 mb-1">
              <Calendar className="w-4 h-4 mr-1" />
              Start Date
            </div>
            <p className="font-medium">{format(startDate, 'MMM dd, yyyy')}</p>
          </div>
          <div>
            <div className="flex items-center text-gray-600 mb-1">
              <Calendar className="w-4 h-4 mr-1" />
              End Date
            </div>
            <p className="font-medium">{format(endDate, 'MMM dd, yyyy')}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Amount:</span>
            <span className="font-bold text-lg">€{booking.total_price}</span>
          </div>
          {booking.security_deposit > 0 && (
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">Security Deposit:</span>
              <span className="text-xs">€{booking.security_deposit}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onMessage(booking)}
            className="flex-1"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Message
          </Button>
          {getStatusActions() && (
            <div className="flex-1">
              {getStatusActions()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};