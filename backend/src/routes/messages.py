from flask import Blueprint, request, jsonify, session
from src.models.user import db, Message, Booking, User
from datetime import datetime

messages_bp = Blueprint('messages', __name__)

@messages_bp.route('/', methods=['POST'])
def create_message():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['booking_id', 'receiver_id', 'content']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Verify booking exists and user is involved
        booking = Booking.query.get(data['booking_id'])
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        if booking.borrower_id != user_id and booking.lender_id != user_id:
            return jsonify({'error': 'Not authorized to message in this booking'}), 403
        
        # Create message
        message = Message(
            booking_id=data['booking_id'],
            sender_id=user_id,
            receiver_id=data['receiver_id'],
            content=data['content']
        )
        
        db.session.add(message)
        db.session.commit()
        
        return jsonify(message.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@messages_bp.route('/booking/<int:booking_id>', methods=['GET'])
def get_booking_messages(booking_id):
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        # Verify user is involved in booking
        booking = Booking.query.get(booking_id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        if booking.borrower_id != user_id and booking.lender_id != user_id:
            return jsonify({'error': 'Not authorized to view these messages'}), 403
        
        # Get messages
        messages = Message.query.filter_by(booking_id=booking_id).order_by(Message.created_at.asc()).all()
        
        # Mark messages as read
        Message.query.filter_by(
            booking_id=booking_id,
            receiver_id=user_id,
            is_read=False
        ).update({'is_read': True})
        db.session.commit()
        
        return jsonify({
            'messages': [message.to_dict() for message in messages]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@messages_bp.route('/conversations', methods=['GET'])
def get_conversations():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        # Get all bookings where user is involved
        bookings = Booking.query.filter(
            (Booking.borrower_id == user_id) | (Booking.lender_id == user_id)
        ).all()
        
        conversations = []
        for booking in bookings:
            # Get last message for this booking
            last_message = Message.query.filter_by(booking_id=booking.id).order_by(Message.created_at.desc()).first()
            
            if last_message:
                # Determine other user
                other_user = booking.borrower if booking.lender_id == user_id else booking.lender
                
                # Count unread messages
                unread_count = Message.query.filter_by(
                    booking_id=booking.id,
                    receiver_id=user_id,
                    is_read=False
                ).count()
                
                conversations.append({
                    'id': booking.id,
                    'booking_id': booking.id,
                    'other_user': other_user.to_dict(),
                    'tool': booking.tool.to_dict(),
                    'last_message_at': last_message.created_at.isoformat(),
                    'unread_count': unread_count
                })
        
        # Sort by last message time
        conversations.sort(key=lambda x: x['last_message_at'], reverse=True)
        
        return jsonify({
            'conversations': conversations
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@messages_bp.route('/<int:message_id>/read', methods=['PUT'])
def mark_message_read(message_id):
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        message = Message.query.get(message_id)
        if not message:
            return jsonify({'error': 'Message not found'}), 404
        
        if message.receiver_id != user_id:
            return jsonify({'error': 'Not authorized to mark this message as read'}), 403
        
        message.is_read = True
        db.session.commit()
        
        return jsonify(message.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500