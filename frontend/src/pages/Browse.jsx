import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin,
  Grid,
  List
} from 'lucide-react';

export const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample tools data - in real app this would come from API
  const sampleTools = [
    {
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
      available: true
    },
    {
      id: 2,
      name: "Ryobi Circular Saw",
      category: "Power Tools",
      price: 12,
      rating: 4.6,
      reviews: 18,
      image: "/src/assets/tools/power-tools/ryobi-circular-saw.jpg",
      owner: "Maria S.",
      location: "Medijana",
      distance: "1.2 km",
      available: true
    },
    {
      id: 3,
      name: "Professional Hammer Set",
      category: "Hand Tools",
      price: 3,
      rating: 4.9,
      reviews: 31,
      image: "/src/assets/tools/hand-tools/claw-hammer.jpg",
      owner: "Stefan P.",
      location: "Pantelej",
      distance: "2.1 km",
      available: false
    },
    {
      id: 4,
      name: "Bosch Orbital Sander",
      category: "Power Tools",
      price: 10,
      rating: 4.7,
      reviews: 15,
      image: "/src/assets/tools/power-tools/bosch-orbital-sander.jpg",
      owner: "Ana M.",
      location: "Crveni Krst",
      distance: "1.8 km",
      available: true
    },
    {
      id: 5,
      name: "Metric Wrench Set",
      category: "Hand Tools",
      price: 5,
      rating: 4.5,
      reviews: 22,
      image: "/src/assets/tools/hand-tools/metric-wrench-set.jpg",
      owner: "Marko J.",
      location: "Niš Center",
      distance: "0.8 km",
      available: true
    },
    {
      id: 6,
      name: "Electric Lawn Mower",
      category: "Garden Tools",
      price: 15,
      rating: 4.4,
      reviews: 12,
      image: "/src/assets/tools/garden-tools/electric-lawn-mower.jpg",
      owner: "Petar N.",
      location: "Dušanovac",
      distance: "3.2 km",
      available: true
    }
  ];

  const categories = [
    "All Categories",
    "Power Tools",
    "Hand Tools", 
    "Garden Tools",
    "Construction Tools",
    "Automotive Tools"
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      let filteredTools = sampleTools;

      // Filter by search query
      if (searchQuery) {
        filteredTools = filteredTools.filter(tool =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by category
      if (selectedCategory && selectedCategory !== 'All Categories') {
        filteredTools = filteredTools.filter(tool => tool.category === selectedCategory);
      }

      // Sort tools
      switch (sortBy) {
        case 'price-low':
          filteredTools.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredTools.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredTools.sort((a, b) => b.rating - a.rating);
          break;
        case 'distance':
          filteredTools.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
          break;
        default:
          // relevance - keep original order
          break;
      }

      setTools(filteredTools);
      setLoading(false);
    }, 500);
  }, [searchQuery, selectedCategory, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams);
    if (category && category !== 'All Categories') {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const ToolCard = ({ tool, isListView = false }) => (
    <Link to={`/tool/${tool.id}`}>
      <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${isListView ? 'flex' : ''}`}>
        <div className={`${isListView ? 'w-48 h-32' : 'aspect-video'} bg-gray-100 rounded-t-lg overflow-hidden ${isListView ? 'rounded-l-lg rounded-tr-none' : ''}`}>
          <img 
            src={tool.image} 
            alt={tool.name}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className={`p-4 ${isListView ? 'flex-1' : ''}`}>
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary" className="text-xs">{tool.category}</Badge>
            <div className="text-right">
              <span className="font-bold text-lg text-blue-600">€{tool.price}/day</span>
              {!tool.available && (
                <Badge variant="destructive" className="ml-2 text-xs">Unavailable</Badge>
              )}
            </div>
          </div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{tool.name}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium ml-1">{tool.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({tool.reviews} reviews)</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>by {tool.owner}</span>
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{tool.distance}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Tools</h1>
          
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg"
                />
              </div>
            </form>
            
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="distance">Nearest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${tools.length} tools found`}
          </p>
        </div>

        {/* Tools Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : tools.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all categories.
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('');
              setSearchParams({});
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} isListView={viewMode === 'list'} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

