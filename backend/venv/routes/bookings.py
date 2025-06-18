from flask import Blueprint, request, jsonify, session
from src.models.user import db, Booking, Tool, User
from datetime import datetime, timedelta

bookings_bp = Blueprint('bookings', __name__)

@bookings_bp.route('/', methods=['POST'])
def create_booking():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['tool_id', 'start_date', 'end_date']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Get tool
        tool = Tool.query.get(data['tool_id'])
        if not tool:
            return jsonify({'error': 'Tool not found'}), 404
        
        if not tool.is_available:
            return jsonify({'error': 'Tool is not available'}), 400
        
        if tool.owner_id == user_id:
            return jsonify({'error': 'Cannot book your own tool'}), 400
        
        # Parse dates
        start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
        
        if start_date >= end_date:
            return jsonify({'error': 'End date must be after start date'}), 400
        
        if start_date < datetime.utcnow():
            return jsonify({'error': 'Start date cannot be in the past'}), 400
        
        # Check for conflicting bookings
        conflicting_booking = Booking.query.filter(
            Booking.tool_id == data['tool_id'],
            Booking.status.in_(['confirmed', 'active']),
            Booking.start_date < end_date,
            Booking.end_date > start_date
        ).first()
        
        if conflicting_booking:
            return jsonify({'error': 'Tool is already booked for this period'}), 400
        
        # Calculate total price
        duration_days = (end_date - start_date).days
        if duration_days == 0:
            duration_days = 1  # Minimum 1 day
        
        total_price = duration_days * tool.price_per_day
        
        # Create booking
        booking = Booking(
            tool_id=data['tool_id'],
            borrower_id=user_id,
            lender_id=tool.owner_id,
            start_date=start_date,
            end_date=end_date,
            total_price=total_price,
            security_deposit=tool.security_deposit,
            pickup_delivery_method=data.get('pickup_delivery_method', 'pickup'),
            status='pending'
        )
        
        db.session.add(booking)
        db.session.commit()
        
        return jsonify(booking.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/', methods=['GET'])
def get_bookings():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        # Get query parameters
        booking_type = request.args.get('type', 'all')  # all, borrower, lender
        status = request.args.get('status')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        # Build query
        if booking_type == 'borrower':
            query = Booking.query.filter_by(borrower_id=user_id)
        elif booking_type == 'lender':
            query = Booking.query.filter_by(lender_id=user_id)
        else:
            query = Booking.query.filter(
                (Booking.borrower_id == user_id) | (Booking.lender_id == user_id)
            )
        
        # Apply status filter
        if status:
            query = query.filter_by(status=status)
        
        # Order by creation date
        query = query.order_by(Booking.created_at.desc())
        
        # Paginate
        bookings = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'bookings': [booking.to_dict() for booking in bookings.items],
            'total': bookings.total,
            'pages': bookings.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/<int:booking_id>', methods=['GET'])
def get_booking(booking_id):
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        booking = Booking.query.get(booking_id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Check if user is involved in this booking
        if booking.borrower_id != user_id and booking.lender_id != user_id:
            return jsonify({'error': 'Not authorized to view this booking'}), 403
        
        return jsonify(booking.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/<int:booking_id>/status', methods=['PUT'])
def update_booking_status(booking_id):
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        booking = Booking.query.get(booking_id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status:
            return jsonify({'error': 'Status is required'}), 400
        
        # Check authorization based on status change
        if new_status in ['confirmed', 'cancelled'] and booking.lender_id != user_id:
            return jsonify({'error': 'Only the lender can confirm or cancel bookings'}), 403
        
        if new_status == 'cancelled' and booking.borrower_id != user_id and booking.lender_id != user_id:
            return jsonify({'error': 'Only borrower or lender can cancel bookings'}), 403
        
        # Validate status transitions
        valid_transitions = {
            'pending': ['confirmed', 'cancelled'],
            'confirmed': ['active', 'cancelled'],
            'active': ['completed', 'cancelled'],
            'completed': [],
            'cancelled': []
        }
        
        if new_status not in valid_transitions.get(booking.status, []):
            return jsonify({'error': f'Cannot change status from {booking.status} to {new_status}'}), 400
        
        booking.status = new_status
        booking.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(booking.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        booking = Booking.query.get(booking_id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Only borrower can delete pending bookings
        if booking.borrower_id != user_id:
            return jsonify({'error': 'Not authorized to delete this booking'}), 403
        
        if booking.status != 'pending':
            return jsonify({'error': 'Can only delete pending bookings'}), 400
        
        db.session.delete(booking)
        db.session.commit()
        
        return jsonify({'message': 'Booking deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

