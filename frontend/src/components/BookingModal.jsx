import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar as CalendarIcon, Clock, Euro, Shield } from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

export const BookingModal = ({ tool, trigger, onBookingSuccess }) => {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rentalPeriod, setRentalPeriod] = useState('daily');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculatePrice = () => {
    if (!startDate || !endDate) return 0;
    
    const days = differenceInDays(endDate, startDate) + 1;
    
    switch (rentalPeriod) {
      case 'hourly':
        return days * 8 * (tool.price_per_hour || tool.price_per_day / 8);
      case 'daily':
        return days * tool.price_per_day;
      case 'weekly':
        const weeks = Math.ceil(days / 7);
        return weeks * (tool.price_per_week || tool.price_per_day * 7 * 0.85);
      default:
        return days * tool.price_per_day;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      setLoading(false);
      return;
    }

    if (startDate >= endDate) {
      setError('End date must be after start date');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          tool_id: tool.id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          pickup_delivery_method: 'pickup',
          message: message
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOpen(false);
        onBookingSuccess?.(data);
        // Reset form
        setStartDate(null);
        setEndDate(null);
        setMessage('');
      } else {
        setError(data.error || 'Failed to create booking');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = calculatePrice();
  const securityDeposit = tool.security_deposit || 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book {tool.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Rental Period</Label>
            <Select value={rentalPeriod} onValueChange={setRentalPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tool.price_per_hour && <SelectItem value="hourly">Hourly</SelectItem>}
                <SelectItem value="daily">Daily</SelectItem>
                {tool.price_per_week && <SelectItem value="weekly">Weekly</SelectItem>}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date < (startDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message to Owner (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Tell the owner about your project..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {startDate && endDate && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Rental Cost:</span>
                <span className="font-medium">€{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit:</span>
                <span className="font-medium">€{securityDeposit.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span>€{(totalPrice + securityDeposit).toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-600">
                Security deposit will be refunded after tool return
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !startDate || !endDate} className="flex-1">
              {loading ? 'Booking...' : 'Book Tool'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};