import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Shield, 
  Users, 
  Clock, 
  Star,
  ArrowRight,
  Wrench,
  Hammer,
  Drill
} from 'lucide-react';

export const Home = () => {
  const featuredTools = [
    {
      id: 1,
      name: "DEWALT 20V Cordless Drill",
      category: "Power Tools",
      price: "€8/day",
      rating: 4.8,
      reviews: 24,
      image: "/src/assets/tools/power-tools/dewalt-drill.jpg",
      owner: "John D.",
      location: "Niš Center"
    },
    {
      id: 2,
      name: "Ryobi Circular Saw",
      category: "Power Tools", 
      price: "€12/day",
      rating: 4.6,
      reviews: 18,
      image: "/src/assets/tools/power-tools/ryobi-circular-saw.jpg",
      owner: "Maria S.",
      location: "Medijana"
    },
    {
      id: 3,
      name: "Professional Hammer Set",
      category: "Hand Tools",
      price: "€3/day",
      rating: 4.9,
      reviews: 31,
      image: "/src/assets/tools/hand-tools/claw-hammer.jpg",
      owner: "Stefan P.",
      location: "Pantelej"
    }
  ];

  const categories = [
    { name: "Power Tools", icon: Drill, count: 156, color: "bg-blue-100 text-blue-600" },
    { name: "Hand Tools", icon: Hammer, count: 89, color: "bg-green-100 text-green-600" },
    { name: "Garden Tools", icon: Wrench, count: 67, color: "bg-yellow-100 text-yellow-600" },
    { name: "Construction", icon: Wrench, count: 43, color: "bg-purple-100 text-purple-600" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "All users are verified and tools are insured for your peace of mind."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Connect with neighbors and build stronger local communities."
    },
    {
      icon: Clock,
      title: "Flexible Rental",
      description: "Rent by the hour, day, or week. Perfect for any project size."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Share Tools,
              <span className="text-blue-600"> Build Community</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Borrow the tools you need for your next project or earn money by lending 
              your unused tools to neighbors in Niš.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse">
                <Button size="lg" className="px-8 py-3 text-lg">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Tools
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                  Join ToolShare
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose ToolShare?
            </h2>
            <p className="text-lg text-gray-600">
              The smart way to access tools without the cost of ownership
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find the perfect tool for your project
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={index} to={`/browse?category=${category.name}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <category.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                    <p className="text-gray-600">{category.count} tools</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Tools
              </h2>
              <p className="text-lg text-gray-600">
                Popular tools available for rent in your area
              </p>
            </div>
            <Link to="/browse">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTools.map((tool) => (
              <Link key={tool.id} to={`/tool/${tool.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                    <img 
                      src={tool.image} 
                      alt={tool.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{tool.category}</Badge>
                      <span className="font-bold text-lg text-blue-600">{tool.price}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{tool.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium ml-1">{tool.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({tool.reviews} reviews)</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>by {tool.owner}</span>
                      <span>{tool.location}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Sharing?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already saving money and building 
            stronger communities through tool sharing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
                Get Started Today
              </Button>
            </Link>
            <Link to="/add-tool">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-blue-600">
                List Your First Tool
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

