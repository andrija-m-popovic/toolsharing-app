from flask import Blueprint, request, jsonify, session
from src.models.user import db, Tool, Category, ToolImage, User
from datetime import datetime
from sqlalchemy import or_, and_

tools_bp = Blueprint('tools', __name__)

@tools_bp.route('/', methods=['GET'])
def get_tools():
    try:
        # Get query parameters
        search = request.args.get('search', '')
        category_id = request.args.get('category_id')
        sort_by = request.args.get('sort_by', 'created_at')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        # Build query
        query = Tool.query.filter(Tool.is_available == True)
        
        # Apply search filter
        if search:
            query = query.join(User).filter(
                or_(
                    Tool.name.ilike(f'%{search}%'),
                    Tool.description.ilike(f'%{search}%'),
                    Tool.brand_model.ilike(f'%{search}%')
                )
            )
        
        # Apply category filter
        if category_id:
            query = query.filter(Tool.category_id == category_id)
        
        # Apply sorting
        if sort_by == 'price_low':
            query = query.order_by(Tool.price_per_day.asc())
        elif sort_by == 'price_high':
            query = query.order_by(Tool.price_per_day.desc())
        elif sort_by == 'newest':
            query = query.order_by(Tool.created_at.desc())
        else:
            query = query.order_by(Tool.created_at.desc())
        
        # Paginate
        tools = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'tools': [tool.to_dict() for tool in tools.items],
            'total': tools.total,
            'pages': tools.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tools_bp.route('/<int:tool_id>', methods=['GET'])
def get_tool(tool_id):
    try:
        tool = Tool.query.get(tool_id)
        if not tool:
            return jsonify({'error': 'Tool not found'}), 404
        
        return jsonify(tool.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tools_bp.route('/', methods=['POST'])
def create_tool():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'category_id', 'description', 'price_per_day']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create new tool
        tool = Tool(
            owner_id=user_id,
            category_id=data['category_id'],
            name=data['name'],
            brand_model=data.get('brand_model'),
            description=data['description'],
            condition=data.get('condition', 'Good'),
            price_per_hour=data.get('price_per_hour'),
            price_per_day=data['price_per_day'],
            price_per_week=data.get('price_per_week'),
            security_deposit=data.get('security_deposit', 0),
            pickup_delivery_options=data.get('pickup_delivery_options', 'Pickup only')
        )
        
        db.session.add(tool)
        db.session.flush()  # Get the tool ID
        
        # Add images if provided
        if data.get('images'):
            for i, image_url in enumerate(data['images']):
                image = ToolImage(
                    tool_id=tool.id,
                    image_url=image_url,
                    is_primary=(i == 0)
                )
                db.session.add(image)
        
        db.session.commit()
        
        return jsonify(tool.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tools_bp.route('/<int:tool_id>', methods=['PUT'])
def update_tool(tool_id):
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        tool = Tool.query.get(tool_id)
        if not tool:
            return jsonify({'error': 'Tool not found'}), 404
        
        if tool.owner_id != user_id:
            return jsonify({'error': 'Not authorized to update this tool'}), 403
        
        data = request.get_json()
        
        # Update allowed fields
        if 'name' in data:
            tool.name = data['name']
        if 'brand_model' in data:
            tool.brand_model = data['brand_model']
        if 'description' in data:
            tool.description = data['description']
        if 'condition' in data:
            tool.condition = data['condition']
        if 'price_per_hour' in data:
            tool.price_per_hour = data['price_per_hour']
        if 'price_per_day' in data:
            tool.price_per_day = data['price_per_day']
        if 'price_per_week' in data:
            tool.price_per_week = data['price_per_week']
        if 'security_deposit' in data:
            tool.security_deposit = data['security_deposit']
        if 'pickup_delivery_options' in data:
            tool.pickup_delivery_options = data['pickup_delivery_options']
        if 'is_available' in data:
            tool.is_available = data['is_available']
        
        tool.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(tool.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tools_bp.route('/<int:tool_id>', methods=['DELETE'])
def delete_tool(tool_id):
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        tool = Tool.query.get(tool_id)
        if not tool:
            return jsonify({'error': 'Tool not found'}), 404
        
        if tool.owner_id != user_id:
            return jsonify({'error': 'Not authorized to delete this tool'}), 403
        
        db.session.delete(tool)
        db.session.commit()
        
        return jsonify({'message': 'Tool deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tools_bp.route('/my-tools', methods=['GET'])
def get_my_tools():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        tools = Tool.query.filter_by(owner_id=user_id).order_by(Tool.created_at.desc()).all()
        
        return jsonify([tool.to_dict() for tool in tools]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

