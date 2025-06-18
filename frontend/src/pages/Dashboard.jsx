import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Calendar, 
  Star, 
  DollarSign, 
  Package, 
  Users,
  TrendingUp,
  Eye
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Total Earnings', value: '€245', icon: DollarSign, change: '+12%' },
    { title: 'Active Listings', value: '8', icon: Package, change: '+2' },
    { title: 'Total Bookings', value: '23', icon: Calendar, change: '+5' },
    { title: 'Average Rating', value: '4.8', icon: Star, change: '+0.2' }
  ];

  const recentBookings = [
    {
      id: 1,
      tool: 'DEWALT Cordless Drill',
      borrower: 'Ana M.',
      dates: 'Dec 15-17, 2024',
      status: 'active',
      amount: '€24'
    },
    {
      id: 2,
      tool: 'Circular Saw',
      borrower: 'Marko J.',
      dates: 'Dec 12-14, 2024',
      status: 'completed',
      amount: '€36'
    },
    {
      id: 3,
      tool: 'Orbital Sander',
      borrower: 'Stefan P.',
      dates: 'Dec 20-22, 2024',
      status: 'pending',
      amount: '€30'
    }
  ];

  const myTools = [
    {
      id: 1,
      name: 'DEWALT Cordless Drill',
      category: 'Power Tools',
      price: '€8/day',
      status: 'rented',
      views: 45,
      bookings: 8
    },
    {
      id: 2,
      name: 'Circular Saw',
      category: 'Power Tools',
      price: '€12/day',
      status: 'available',
      views: 32,
      bookings: 5
    },
    {
      id: 3,
      name: 'Orbital Sander',
      category: 'Power Tools',
      price: '€10/day',
      status: 'available',
      views: 28,
      bookings: 3
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'available': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your tools and bookings.
          </p>
        </div>

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
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
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
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{booking.tool}</h4>
                      <p className="text-sm text-gray-600">by {booking.borrower}</p>
                      <p className="text-sm text-gray-500">{booking.dates}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <p className="text-sm font-medium text-gray-900 mt-1">{booking.amount}</p>
                    </div>
                  </div>
                ))}
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
                {myTools.map((tool) => (
                  <div key={tool.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{tool.name}</h4>
                      <p className="text-sm text-gray-600">{tool.category}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Eye className="w-4 h-4 mr-1" />
                          {tool.views} views
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {tool.bookings} bookings
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(tool.status)}>
                        {tool.status}
                      </Badge>
                      <p className="text-sm font-medium text-gray-900 mt-1">{tool.price}</p>
                    </div>
                  </div>
                ))}
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

