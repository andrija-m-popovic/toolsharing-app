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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalTools, setTotalTools] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTools();
  }, [searchQuery, selectedCategory, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories([{ id: '', name: 'All Categories' }, ...data]);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchTools = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category_id', selectedCategory);
      if (sortBy !== 'relevance') params.append('sort_by', sortBy);
      
      const response = await fetch(`http://localhost:5000/api/tools?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTools(data.tools || []);
        setTotalTools(data.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch tools:', error);
    } finally {
      setLoading(false);
    }
  };

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
    if (category && category !== '') {
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
          {tool.images && tool.images.length > 0 ? (
            <img 
              src={tool.images.find(img => img.is_primary)?.image_url || tool.images[0]?.image_url} 
              alt={tool.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <CardContent className={`p-4 ${isListView ? 'flex-1' : ''}`}>
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary" className="text-xs">{tool.category?.name}</Badge>
            <div className="text-right">
              <span className="font-bold text-lg text-blue-600">€{tool.price_per_day}/day</span>
              {!tool.is_available && (
                <Badge variant="destructive" className="ml-2 text-xs">Unavailable</Badge>
              )}
            </div>
          </div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{tool.name}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium ml-1">{tool.average_rating?.toFixed(1) || 'No rating'}</span>
            </div>
            <span className="text-sm text-gray-500">({tool.review_count || 0} reviews)</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>by {tool.owner?.full_name || tool.owner?.username}</span>
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{tool.owner?.location}</span>
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
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
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
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
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
            {loading ? 'Loading...' : `${totalTools} tools found`}
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