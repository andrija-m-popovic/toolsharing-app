import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Calendar, 
  Star, 
  DollarSign, 
  Package, 
  Users,
  TrendingUp,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [myTools, setMyTools] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeListings: 0,
    totalBookings: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(location.state?.message || '');

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's tools
      const toolsResponse = await fetch('http://localhost:5000/api/tools/my-tools', {
        credentials: 'include',
      });
      if (toolsResponse.ok) {
        const toolsData = await toolsResponse.json();
        setMyTools(toolsData);
      }

      // Fetch recent bookings
      const bookingsResponse = await fetch('http://localhost:5000/api/bookings?type=lender&per_page=5', {
        credentials: 'include',
      });
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setRecentBookings(bookingsData.bookings || []);
      }

      // Calculate stats (this would be better done on the backend)
      // For now, we'll calculate basic stats from the data we have
      setStats({
        totalEarnings: 245, // Mock data
        activeListings: toolsData?.length || 0,
        totalBookings: 23, // Mock data
        averageRating: 4.8 // Mock data
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTool = async (toolId) => {
    if (!confirm('Are you sure you want to delete this tool listing?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/tools/${toolId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setMyTools(prev => prev.filter(tool => tool.id !== toolId));
        setMessage('Tool deleted successfully!');
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to delete tool');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Please log in to view your dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.full_name || user?.username}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your tools and bookings.
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/add-tool">
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>List New Tool</span>
              </Button>
            </Link>
            <Link to="/bookings">
              <Button variant="outline" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>View All Bookings</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">€{stats.totalEarnings}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12%</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeListings}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+2</span>
                <span className="text-sm text-gray-500 ml-1">new this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+5</span>
                <span className="text-sm text-gray-500 ml-1">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+0.2</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>
                Latest rental activity for your tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse p-4 border rounded-lg">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  ))
                ) : recentBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-600">No recent bookings</p>
                  </div>
                ) : (
                  recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{booking.tool?.name}</h4>
                        <p className="text-sm text-gray-600">by {booking.borrower?.full_name || booking.borrower?.username}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                        <p className="text-sm font-medium text-gray-900 mt-1">€{booking.total_price}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4">
                <Link to="/bookings">
                  <Button variant="outline" className="w-full">
                    View All Bookings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* My Tools */}
          <Card>
            <CardHeader>
              <CardTitle>My Tools</CardTitle>
              <CardDescription>
                Manage your listed tools and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse p-4 border rounded-lg">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  ))
                ) : myTools.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-600 mb-4">No tools listed yet</p>
                    <Link to="/add-tool">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        List Your First Tool
                      </Button>
                    </Link>
                  </div>
                ) : (
                  myTools.slice(0, 5).map((tool) => (
                    <div key={tool.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{tool.name}</h4>
                        <p className="text-sm text-gray-600">{tool.category?.name}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Eye className="w-4 h-4 mr-1" />
                            {tool.views || 0} views
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {tool.bookings || 0} bookings
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={tool.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {tool.is_available ? 'Available' : 'Unavailable'}
                        </Badge>
                        <div className="flex space-x-1">
                          <Link to={`/tool/${tool.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link to={`/edit-tool/${tool.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteTool(tool.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4">
                <Link to="/add-tool">
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Tool
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};