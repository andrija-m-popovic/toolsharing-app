import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Star } from 'lucide-react';

export const ReviewModal = ({ booking, open, onClose, onSuccess }) => {
  const [toolRating, setToolRating] = useState(0);
  const [toolComment, setToolComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const StarRating = ({ rating, onRatingChange, label }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`w-6 h-6 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Submit tool review
      if (toolRating > 0) {
        const toolReviewResponse = await fetch('http://localhost:5000/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            booking_id: booking.id,
            rating: toolRating,
            comment: toolComment,
            review_type: 'tool_review'
          }),
        });

        if (!toolReviewResponse.ok) {
          const data = await toolReviewResponse.json();
          throw new Error(data.error || 'Failed to submit tool review');
        }
      }

      // Submit user review
      if (userRating > 0) {
        const userReviewResponse = await fetch('http://localhost:5000/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            booking_id: booking.id,
            rating: userRating,
            comment: userComment,
            review_type: 'user_review'
          }),
        });

        if (!userReviewResponse.ok) {
          const data = await userReviewResponse.json();
          throw new Error(data.error || 'Failed to submit user review');
        }
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <StarRating
              rating={toolRating}
              onRatingChange={setToolRating}
              label={`Rate the tool: ${booking.tool?.name}`}
            />
            <div className="space-y-2">
              <Label htmlFor="toolComment">Tool Review (Optional)</Label>
              <Textarea
                id="toolComment"
                placeholder="How was the tool? Was it as described?"
                value={toolComment}
                onChange={(e) => setToolComment(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <StarRating
              rating={userRating}
              onRatingChange={setUserRating}
              label={`Rate the owner: ${booking.lender?.full_name || booking.lender?.username}`}
            />
            <div className="space-y-2">
              <Label htmlFor="userComment">Owner Review (Optional)</Label>
              <Textarea
                id="userComment"
                placeholder="How was your experience with the owner?"
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || (toolRating === 0 && userRating === 0)} 
              className="flex-1"
            >
              {loading ? 'Submitting...' : 'Submit Reviews'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};