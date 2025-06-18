import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookingModal } from '../components/BookingModal';
import { useAuth } from '../contexts/AuthContext';
import { Star, MapPin, Calendar, Shield, User, ArrowLeft, MessageCircle } from 'lucide-react';

export const ToolDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [tool, setTool] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTool();
    fetchReviews();
  }, [id]);

  const fetchTool = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tools/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTool(data);
      } else {
        setError('Tool not found');
      }
    } catch (error) {
      setError('Failed to load tool details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/tool/${id}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleBookingSuccess = (booking) => {
    // Show success message or redirect
    console.log('Booking created:', booking);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Tool Not Found</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link to="/browse">
              <Button>Browse Other Tools</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const primaryImage = tool.images?.find(img => img.is_primary) || tool.images?.[0];
  const isOwner = user && user.id === tool.owner_id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/browse">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Browse</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <img 
                src={primaryImage?.image_url || '/placeholder-tool.jpg'} 
                alt={tool.name}
                className="w-full h-full object-cover"
              />
            </div>
            {tool.images && tool.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {tool.images.map((image, index) => (
                  <div key={index} className="aspect-square bg-white rounded-lg overflow-hidden">
                    <img 
                      src={image.image_url} 
                      alt={`${tool.name} ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">{tool.category?.name}</Badge>
              <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
              {tool.brand_model && (
                <p className="text-lg text-gray-600 mt-1">{tool.brand_model}</p>
              )}
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium">{tool.average_rating?.toFixed(1) || 'No ratings'}</span>
                  <span className="text-gray-500 ml-1">({tool.review_count || 0} reviews)</span>
                </div>
                {!tool.is_available && (
                  <Badge variant="destructive">Currently Unavailable</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">
                €{tool.price_per_day}/day
              </div>
              {tool.price_per_hour && (
                <div className="text-lg text-gray-600">
                  €{tool.price_per_hour}/hour
                </div>
              )}
              {tool.price_per_week && (
                <div className="text-lg text-gray-600">
                  €{tool.price_per_week}/week
                </div>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">{tool.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Condition:</span>
                <span className="ml-2 text-gray-600">{tool.condition}</span>
              </div>
              <div>
                <span className="font-medium">Security Deposit:</span>
                <span className="ml-2 text-gray-600">€{tool.security_deposit || 0}</span>
              </div>
              <div className="col-span-2">
                <span className="font-medium">Pickup/Delivery:</span>
                <span className="ml-2 text-gray-600">{tool.pickup_delivery_options}</span>
              </div>
            </div>

            {/* Owner Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={tool.owner?.profile_picture_url} />
                    <AvatarFallback>
                      {tool.owner?.full_name?.charAt(0) || tool.owner?.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{tool.owner?.full_name || tool.owner?.username}</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {tool.owner?.location}
                    </div>
                    {tool.owner?.is_verified && (
                      <Badge variant="secondary" className="mt-1">Verified</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isOwner && user && tool.is_available ? (
                <BookingModal
                  tool={tool}
                  trigger={
                    <Button className="w-full" size="lg">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book This Tool
                    </Button>
                  }
                  onBookingSuccess={handleBookingSuccess}
                />
              ) : isOwner ? (
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/edit-tool/${tool.id}`}>
                      Edit Tool Listing
                    </Link>
                  </Button>
                  <p className="text-sm text-gray-600 text-center">
                    This is your tool listing
                  </p>
                </div>
              ) : !user ? (
                <Button className="w-full" size="lg" asChild>
                  <Link to="/login">
                    <Calendar className="w-4 h-4 mr-2" />
                    Login to Book
                  </Link>
                </Button>
              ) : (
                <Button className="w-full" size="lg" disabled>
                  Currently Unavailable
                </Button>
              )}
              
              {!isOwner && (
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Owner
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.reviewer?.profile_picture_url} />
                        <AvatarFallback>
                          {review.reviewer?.full_name?.charAt(0) || review.reviewer?.username?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">
                            {review.reviewer?.full_name || review.reviewer?.username}
                          </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-600">{review.comment}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};