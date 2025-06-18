import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Calendar, Shield, User } from 'lucide-react';

export const ToolDetail = () => {
  const { id } = useParams();
  
  // Sample tool data - in real app this would come from API
  const tool = {
    id: 1,
    name: "DEWALT 20V Cordless Drill",
    category: "Power Tools",
    price: 8,
    rating: 4.8,
    reviews: 24,
    image: "/src/assets/tools/power-tools/dewalt-drill.jpg",
    owner: "John D.",
    location: "Niš Center",
    distance: "0.5 km",
    available: true,
    description: "Professional grade cordless drill perfect for home improvement projects. Includes battery, charger, and drill bits set.",
    features: ["20V Lithium Battery", "LED Light", "Variable Speed", "Keyless Chuck"],
    condition: "Excellent",
    deposit: 50
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="aspect-square bg-white rounded-lg overflow-hidden">
            <img 
              src={tool.image} 
              alt={tool.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">{tool.category}</Badge>
              <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium">{tool.rating}</span>
                  <span className="text-gray-500 ml-1">({tool.reviews} reviews)</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{tool.distance} away</span>
                </div>
              </div>
            </div>

            <div className="text-3xl font-bold text-blue-600">
              €{tool.price}/day
            </div>

            <p className="text-gray-600">{tool.description}</p>

            <div>
              <h3 className="font-semibold mb-2">Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {tool.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Condition:</span>
                <span className="ml-2 text-gray-600">{tool.condition}</span>
              </div>
              <div>
                <span className="font-medium">Security Deposit:</span>
                <span className="ml-2 text-gray-600">€{tool.deposit}</span>
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Owned by {tool.owner}</h4>
                    <p className="text-sm text-gray-600">{tool.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button className="w-full" size="lg">
                <Calendar className="w-4 h-4 mr-2" />
                Book This Tool
              </Button>
              <Button variant="outline" className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Contact Owner
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

