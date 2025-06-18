from flask import Blueprint, request, jsonify, session
from src.models.user import db, User
from datetime import datetime

notifications_bp = Blueprint('notifications', __name__)

# Mock notification data for demonstration
def get_mock_notifications(user_id):
    return [
        {
            'id': 1,
            'user_id': user_id,
            'type': 'booking_request',
            'title': 'New Booking Request',
            'message': 'Someone wants to rent your DEWALT Drill',
            'is_read': False,
            'created_at': datetime.utcnow().isoformat()
        },
        {
            'id': 2,
            'user_id': user_id,
            'type': 'booking_confirmed',
            'title': 'Booking Confirmed',
            'message': 'Your booking for Circular Saw has been confirmed',
            'is_read': False,
            'created_at': datetime.utcnow().isoformat()
        },
        {
            'id': 3,
            'user_id': user_id,
            'type': 'new_review',
            'title': 'New Review',
            'message': 'You received a 5-star review for your hammer',
            'is_read': True,
            'created_at': datetime.utcnow().isoformat()
        }
    ]

@notifications_bp.route('/', methods=['GET'])
def get_notifications():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        # Get mock notifications (in real app, this would query a notifications table)
        notifications = get_mock_notifications(user_id)
        unread_count = len([n for n in notifications if not n['is_read']])
        
        return jsonify({
            'notifications': notifications,
            'unread_count': unread_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/<int:notification_id>/read', methods=['PUT'])
def mark_notification_read(notification_id):
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        # In a real app, this would update the notification in the database
        # For now, we'll just return success
        
        return jsonify({'message': 'Notification marked as read'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500