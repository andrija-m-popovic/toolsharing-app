import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Plus } from 'lucide-react';

export const ToolForm = ({ tool = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    brand_model: '',
    description: '',
    condition: 'Good',
    price_per_hour: '',
    price_per_day: '',
    price_per_week: '',
    security_deposit: '',
    pickup_delivery_options: 'Pickup only'
  });
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
    if (tool) {
      setFormData({
        name: tool.name || '',
        category_id: tool.category_id || '',
        brand_model: tool.brand_model || '',
        description: tool.description || '',
        condition: tool.condition || 'Good',
        price_per_hour: tool.price_per_hour || '',
        price_per_day: tool.price_per_day || '',
        price_per_week: tool.price_per_week || '',
        security_deposit: tool.security_deposit || '',
        pickup_delivery_options: tool.pickup_delivery_options || 'Pickup only'
      });
      setImages(tool.images || []);
    }
  }, [tool]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          image_url: event.target.result,
          is_primary: prev.length === 0
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      if (filtered.length > 0 && !filtered.some(img => img.is_primary)) {
        filtered[0].is_primary = true;
      }
      return filtered;
    });
  };

  const setPrimaryImage = (imageId) => {
    setImages(prev => prev.map(img => ({
      ...img,
      is_primary: img.id === imageId
    })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = tool 
        ? `http://localhost:5000/api/tools/${tool.id}`
        : 'http://localhost:5000/api/tools';
      
      const method = tool ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        images: images.map(img => img.image_url)
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess?.(data);
      } else {
        setError(data.error || 'Failed to save tool');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{tool ? 'Edit Tool' : 'List New Tool'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tool Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., DEWALT Cordless Drill"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Category *</Label>
              <Select value={formData.category_id} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, category_id: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand_model">Brand/Model</Label>
              <Input
                id="brand_model"
                name="brand_model"
                value={formData.brand_model}
                onChange={handleChange}
                placeholder="e.g., DEWALT DCD771C2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={formData.condition} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, condition: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Very Good">Very Good</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your tool, its features, and what's included..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_per_hour">Price per Hour (€)</Label>
              <Input
                id="price_per_hour"
                name="price_per_hour"
                type="number"
                step="0.01"
                value={formData.price_per_hour}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_per_day">Price per Day (€) *</Label>
              <Input
                id="price_per_day"
                name="price_per_day"
                type="number"
                step="0.01"
                value={formData.price_per_day}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_per_week">Price per Week (€)</Label>
              <Input
                id="price_per_week"
                name="price_per_week"
                type="number"
                step="0.01"
                value={formData.price_per_week}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="security_deposit">Security Deposit (€)</Label>
              <Input
                id="security_deposit"
                name="security_deposit"
                type="number"
                step="0.01"
                value={formData.security_deposit}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickup_delivery_options">Pickup/Delivery</Label>
              <Select value={formData.pickup_delivery_options} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, pickup_delivery_options: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pickup only">Pickup only</SelectItem>
                  <SelectItem value="Delivery available">Delivery available</SelectItem>
                  <SelectItem value="Pickup or delivery">Pickup or delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tool Images</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="images" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload tool images
                    </span>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {images.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.image_url}
                      alt="Tool"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {image.is_primary && (
                      <Badge className="absolute top-2 left-2">Primary</Badge>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {!image.is_primary && (
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => setPrimaryImage(image.id)}
                        >
                          Set Primary
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(image.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : (tool ? 'Update Tool' : 'List Tool')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};