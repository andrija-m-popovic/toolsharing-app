from flask import Blueprint, request, jsonify
from src.models.user import db, Category, Tool

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('/', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.all()
        
        # Add tool count for each category
        result = []
        for category in categories:
            category_dict = category.to_dict()
            category_dict['tool_count'] = Tool.query.filter_by(category_id=category.id, is_available=True).count()
            result.append(category_dict)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/<int:category_id>', methods=['GET'])
def get_category(category_id):
    try:
        category = Category.query.get(category_id)
        if not category:
            return jsonify({'error': 'Category not found'}), 404
        
        category_dict = category.to_dict()
        category_dict['tool_count'] = Tool.query.filter_by(category_id=category.id, is_available=True).count()
        
        return jsonify(category_dict), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/<int:category_id>/tools', methods=['GET'])
def get_category_tools(category_id):
    try:
        category = Category.query.get(category_id)
        if not category:
            return jsonify({'error': 'Category not found'}), 404
        
        # Get query parameters
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        sort_by = request.args.get('sort_by', 'created_at')
        
        # Build query
        query = Tool.query.filter_by(category_id=category_id, is_available=True)
        
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
            'category': category.to_dict(),
            'tools': [tool.to_dict() for tool in tools.items],
            'total': tools.total,
            'pages': tools.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

