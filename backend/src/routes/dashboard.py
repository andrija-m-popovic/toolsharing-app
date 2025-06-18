from flask import Blueprint, request, jsonify, session
from src.models.user import db, Tool, Booking, Review, Message
from datetime import datetime, timedelta

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
def get_dashboard_stats():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        # Get user's tools
        user_tools = Tool.query.filter_by(owner_id=user_id).all()
        tool_ids = [tool.id for tool in user_tools]
        
        # Calculate total earnings from completed bookings
        completed_bookings = Booking.query.filter(
            Booking.tool_id.in_(tool_ids),
            Booking.status == 'completed'
        ).all()
        total_earnings = sum(booking.total_price for booking in completed_bookings)
        
        # Count active listings
        active_listings = len([tool for tool in user_tools if tool.is_available])
        
        # Count total bookings
        total_bookings = Booking.query.filter(
            Booking.tool_id.in_(tool_ids)
        ).count()
        
        # Calculate average rating
        reviews = Review.query.filter(
            Review.tool_id.in_(tool_ids),
            Review.review_type == 'tool_review'
        ).all()
        average_rating = sum(review.rating for review in reviews) / len(reviews) if reviews else 0
        
        # Count pending requests
        pending_requests = Booking.query.filter(
            Booking.tool_id.in_(tool_ids),
            Booking.status == 'pending'
        ).count()
        
        # Count unread messages
        unread_messages = Message.query.filter_by(
            receiver_id=user_id,
            is_read=False
        ).count()
        
        return jsonify({
            'totalEarnings': total_earnings,
            'activeListings': active_listings,
            'totalBookings': total_bookings,
            'averageRating': round(average_rating, 1),
            'pendingRequests': pending_requests,
            'unreadMessages': unread_messages
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500