from flask import Blueprint, request, jsonify, session
from src.models.user import db, Review, Booking, Tool, User
from datetime import datetime

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/', methods=['POST'])
def create_review():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['booking_id', 'rating', 'review_type']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate rating
        rating = data['rating']
        if not isinstance(rating, int) or rating < 1 or rating > 5:
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        
        # Get booking
        booking = Booking.query.get(data['booking_id'])
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Check if user is involved in this booking
        if booking.borrower_id != user_id and booking.lender_id != user_id:
            return jsonify({'error': 'Not authorized to review this booking'}), 403
        
        # Check if booking is completed
        if booking.status != 'completed':
            return jsonify({'error': 'Can only review completed bookings'}), 400
        
        # Determine reviewee based on review type and user role
        review_type = data['review_type']
        if review_type == 'tool_review':
            reviewee_id = booking.lender_id  # Tool owner
        elif review_type == 'user_review':
            # If borrower is reviewing, reviewee is lender and vice versa
            reviewee_id = booking.lender_id if booking.borrower_id == user_id else booking.borrower_id
        else:
            return jsonify({'error': 'Invalid review type'}), 400
        
        # Check if review already exists
        existing_review = Review.query.filter_by(
            booking_id=data['booking_id'],
            reviewer_id=user_id,
            review_type=review_type
        ).first()
        
        if existing_review:
            return jsonify({'error': 'Review already exists for this booking'}), 400
        
        # Create review
        review = Review(
            booking_id=data['booking_id'],
            reviewer_id=user_id,
            reviewee_id=reviewee_id,
            tool_id=booking.tool_id,
            rating=rating,
            comment=data.get('comment', ''),
            review_type=review_type
        )
        
        db.session.add(review)
        db.session.commit()
        
        return jsonify(review.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/tool/<int:tool_id>', methods=['GET'])
def get_tool_reviews(tool_id):
    try:
        tool = Tool.query.get(tool_id)
        if not tool:
            return jsonify({'error': 'Tool not found'}), 404
        
        # Get query parameters
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        # Get tool reviews
        reviews = Review.query.filter_by(
            tool_id=tool_id,
            review_type='tool_review'
        ).order_by(Review.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Calculate average rating
        all_reviews = Review.query.filter_by(tool_id=tool_id, review_type='tool_review').all()
        average_rating = sum(r.rating for r in all_reviews) / len(all_reviews) if all_reviews else 0
        
        return jsonify({
            'reviews': [review.to_dict() for review in reviews.items],
            'total': reviews.total,
            'pages': reviews.pages,
            'current_page': page,
            'per_page': per_page,
            'average_rating': round(average_rating, 1),
            'review_count': len(all_reviews)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_reviews(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get query parameters
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        # Get user reviews (reviews received by this user)
        reviews = Review.query.filter_by(
            reviewee_id=user_id,
            review_type='user_review'
        ).order_by(Review.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Calculate average rating
        all_reviews = Review.query.filter_by(reviewee_id=user_id, review_type='user_review').all()
        average_rating = sum(r.rating for r in all_reviews) / len(all_reviews) if all_reviews else 0
        
        return jsonify({
            'reviews': [review.to_dict() for review in reviews.items],
            'total': reviews.total,
            'pages': reviews.pages,
            'current_page': page,
            'per_page': per_page,
            'average_rating': round(average_rating, 1),
            'review_count': len(all_reviews)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/<int:review_id>', methods=['GET'])
def get_review(review_id):
    try:
        review = Review.query.get(review_id)
        if not review:
            return jsonify({'error': 'Review not found'}), 404
        
        return jsonify(review.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/<int:review_id>', methods=['PUT'])
def update_review(review_id):
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        review = Review.query.get(review_id)
        if not review:
            return jsonify({'error': 'Review not found'}), 404
        
        if review.reviewer_id != user_id:
            return jsonify({'error': 'Not authorized to update this review'}), 403
        
        data = request.get_json()
        
        # Update allowed fields
        if 'rating' in data:
            rating = data['rating']
            if not isinstance(rating, int) or rating < 1 or rating > 5:
                return jsonify({'error': 'Rating must be between 1 and 5'}), 400
            review.rating = rating
        
        if 'comment' in data:
            review.comment = data['comment']
        
        db.session.commit()
        
        return jsonify(review.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        review = Review.query.get(review_id)
        if not review:
            return jsonify({'error': 'Review not found'}), 404
        
        if review.reviewer_id != user_id:
            return jsonify({'error': 'Not authorized to delete this review'}), 403
        
        db.session.delete(review)
        db.session.commit()
        
        return jsonify({'message': 'Review deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

