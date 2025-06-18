import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EarningsAnalytics } from '../components/EarningsAnalytics';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';

export const Analytics = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Please log in to view analytics.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Track your tool sharing performance and earnings
          </p>
        </div>

        <Tabs defaultValue="earnings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="earnings">
            <EarningsAnalytics />
          </TabsContent>

          <TabsContent value="performance">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tool Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Individual tool performance metrics</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Booking patterns and trends</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Projected earnings and growth</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">Advanced Analytics Coming Soon</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Get detailed insights about market trends, competitor analysis, 
                      and optimization recommendations for your tool listings.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};