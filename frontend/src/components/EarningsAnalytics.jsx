import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Package,
  BarChart3,
  PieChart,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const EarningsAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalEarnings: 0,
    monthlyEarnings: 0,
    topTools: [],
    earningsHistory: [],
    bookingStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/analytics/earnings?range=${timeRange}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/analytics/export?range=${timeRange}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `earnings-report-${timeRange}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
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
        <h2 className="text-2xl font-bold">Earnings Analytics</h2>
        <div className="flex space-x-2">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">€{analytics.totalEarnings}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+15%</span>
              <span className="text-sm text-gray-500 ml-1">vs last {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This {timeRange}</p>
                <p className="text-2xl font-bold text-gray-900">€{analytics.monthlyEarnings}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tools</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.bookingStats.activeTools || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Daily Rate</p>
                <p className="text-2xl font-bold text-gray-900">€{analytics.bookingStats.avgDailyRate || 0}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topTools.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No earnings data available yet</p>
              </div>
            ) : (
              analytics.topTools.map((tool, index) => (
                <div key={tool.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">#{index + 1}</Badge>
                    <div>
                      <h4 className="font-medium">{tool.name}</h4>
                      <p className="text-sm text-gray-600">{tool.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">€{tool.earnings}</p>
                    <p className="text-sm text-gray-500">{tool.bookings} bookings</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Earnings Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <PieChart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Earnings chart visualization</p>
              <p className="text-sm text-gray-500">Chart component would be integrated here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};