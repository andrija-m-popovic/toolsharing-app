import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  Calendar, 
  Star, 
  TrendingUp, 
  Users,
  MessageCircle,
  DollarSign,
  BarChart3
} from 'lucide-react';

export const ToolInsights = ({ toolId }) => {
  const [insights, setInsights] = useState({
    views: 0,
    bookings: 0,
    earnings: 0,
    rating: 0,
    reviews: 0,
    viewsHistory: [],
    bookingHistory: [],
    competitorAnalysis: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    if (toolId) {
      fetchInsights();
    }
  }, [toolId, timeRange]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/tools/${toolId}/insights?range=${timeRange}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setInsights(data);
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Tool Performance Insights</h3>
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Eye className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{insights.views}</div>
            <div className="text-sm text-gray-600">Views</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{insights.bookings}</div>
            <div className="text-sm text-gray-600">Bookings</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <DollarSign className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">€{insights.earnings}</div>
            <div className="text-sm text-gray-600">Earnings</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{insights.rating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Performance chart visualization</p>
              <p className="text-sm text-gray-500">Shows views, bookings, and earnings over time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Increase Visibility</h4>
                  <p className="text-sm text-blue-700">
                    Add more detailed photos and improve your tool description to attract more views.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Pricing Optimization</h4>
                  <p className="text-sm text-green-700">
                    Your pricing is competitive. Consider offering weekly discounts to increase longer bookings.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <MessageCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Response Time</h4>
                  <p className="text-sm text-yellow-700">
                    Respond to booking requests within 2 hours to improve your booking conversion rate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitor Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Market Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.competitorAnalysis.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No comparable tools found in your area</p>
              </div>
            ) : (
              insights.competitorAnalysis.map((competitor, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{competitor.name}</h4>
                    <p className="text-sm text-gray-600">{competitor.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€{competitor.price}/day</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="w-3 h-3 mr-1" />
                      {competitor.rating}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};