from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    profile_picture_url = db.Column(db.String(255))
    phone_number = db.Column(db.String(20))
    location = db.Column(db.String(100))
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    tools = db.relationship('Tool', backref='owner', lazy=True, foreign_keys='Tool.owner_id')
    bookings_as_borrower = db.relationship('Booking', backref='borrower', lazy=True, foreign_keys='Booking.borrower_id')
    bookings_as_lender = db.relationship('Booking', backref='lender', lazy=True, foreign_keys='Booking.lender_id')
    reviews_given = db.relationship('Review', backref='reviewer', lazy=True, foreign_keys='Review.reviewer_id')
    reviews_received = db.relationship('Review', backref='reviewee', lazy=True, foreign_keys='Review.reviewee_id')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'profile_picture_url': self.profile_picture_url,
            'phone_number': self.phone_number,
            'location': self.location,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text)
    icon_url = db.Column(db.String(255))

    # Relationships
    tools = db.relationship('Tool', backref='category', lazy=True)

    def __repr__(self):
        return f'<Category {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon_url': self.icon_url
        }

class Tool(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    brand_model = db.Column(db.String(100))
    description = db.Column(db.Text)
    condition = db.Column(db.String(50))
    price_per_hour = db.Column(db.Float)
    price_per_day = db.Column(db.Float)
    price_per_week = db.Column(db.Float)
    security_deposit = db.Column(db.Float)
    pickup_delivery_options = db.Column(db.String(100))
    is_available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    images = db.relationship('ToolImage', backref='tool', lazy=True, cascade='all, delete-orphan')
    bookings = db.relationship('Booking', backref='tool', lazy=True)
    reviews = db.relationship('Review', backref='tool', lazy=True)

    def __repr__(self):
        return f'<Tool {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'category_id': self.category_id,
            'name': self.name,
            'brand_model': self.brand_model,
            'description': self.description,
            'condition': self.condition,
            'price_per_hour': self.price_per_hour,
            'price_per_day': self.price_per_day,
            'price_per_week': self.price_per_week,
            'security_deposit': self.security_deposit,
            'pickup_delivery_options': self.pickup_delivery_options,
            'is_available': self.is_available,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'owner': self.owner.to_dict() if self.owner else None,
            'category': self.category.to_dict() if self.category else None,
            'images': [image.to_dict() for image in self.images],
            'average_rating': self.get_average_rating(),
            'review_count': len(self.reviews)
        }

    def get_average_rating(self):
        if not self.reviews:
            return 0
        return sum(review.rating for review in self.reviews if review.review_type == 'tool_review') / len([r for r in self.reviews if r.review_type == 'tool_review'])

class ToolImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tool_id = db.Column(db.Integer, db.ForeignKey('tool.id'), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<ToolImage {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'tool_id': self.tool_id,
            'image_url': self.image_url,
            'is_primary': self.is_primary,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tool_id = db.Column(db.Integer, db.ForeignKey('tool.id'), nullable=False)
    borrower_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    lender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    security_deposit = db.Column(db.Float)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, active, completed, cancelled
    pickup_delivery_method = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    messages = db.relationship('Message', backref='booking', lazy=True)
    reviews = db.relationship('Review', backref='booking', lazy=True)

    def __repr__(self):
        return f'<Booking {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'tool_id': self.tool_id,
            'borrower_id': self.borrower_id,
            'lender_id': self.lender_id,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'total_price': self.total_price,
            'security_deposit': self.security_deposit,
            'status': self.status,
            'pickup_delivery_method': self.pickup_delivery_method,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'tool': self.tool.to_dict() if self.tool else None,
            'borrower': self.borrower.to_dict() if self.borrower else None,
            'lender': self.lender.to_dict() if self.lender else None
        }

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'), nullable=False)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reviewee_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tool_id = db.Column(db.Integer, db.ForeignKey('tool.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    comment = db.Column(db.Text)
    review_type = db.Column(db.String(20), nullable=False)  # tool_review, user_review
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Review {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'booking_id': self.booking_id,
            'reviewer_id': self.reviewer_id,
            'reviewee_id': self.reviewee_id,
            'tool_id': self.tool_id,
            'rating': self.rating,
            'comment': self.comment,
            'review_type': self.review_type,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'reviewer': self.reviewer.to_dict() if self.reviewer else None,
            'reviewee': self.reviewee.to_dict() if self.reviewee else None
        }

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    sender = db.relationship('User', foreign_keys=[sender_id], backref='sent_messages')
    receiver = db.relationship('User', foreign_keys=[receiver_id], backref='received_messages')

    def __repr__(self):
        return f'<Message {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'booking_id': self.booking_id,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'content': self.content,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'sender': self.sender.to_dict() if self.sender else None,
            'receiver': self.receiver.to_dict() if self.receiver else None
        }

