from flask import Blueprint, request, jsonify, session
from src.models.user import db, Tool, Booking, Review
from datetime import datetime, timedelta
import csv
import io

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/earnings', methods=['GET'])
def get_earnings_analytics():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        time_range = request.args.get('range', 'month')
        
        # Calculate date range
        now = datetime.utcnow()
        if time_range == 'week':
            start_date = now - timedelta(weeks=1)
        elif time_range == 'year':
            start_date = now - timedelta(days=365)
        else:  # month
            start_date = now - timedelta(days=30)
        
        # Get user's tools
        user_tools = Tool.query.filter_by(owner_id=user_id).all()
        tool_ids = [tool.id for tool in user_tools]
        
        # Get completed bookings for user's tools
        completed_bookings = Booking.query.filter(
            Booking.tool_id.in_(tool_ids),
            Booking.status == 'completed',
            Booking.created_at >= start_date
        ).all()
        
        # Calculate analytics
        total_earnings = sum(booking.total_price for booking in completed_bookings)
        monthly_earnings = total_earnings  # For the selected time range
        
        # Top performing tools
        tool_earnings = {}
        for booking in completed_bookings:
            tool_id = booking.tool_id
            if tool_id not in tool_earnings:
                tool_earnings[tool_id] = {'earnings': 0, 'bookings': 0}
            tool_earnings[tool_id]['earnings'] += booking.total_price
            tool_earnings[tool_id]['bookings'] += 1
        
        top_tools = []
        for tool in user_tools:
            if tool.id in tool_earnings:
                top_tools.append({
                    'id': tool.id,
                    'name': tool.name,
                    'category': tool.category.name if tool.category else 'Unknown',
                    'earnings': tool_earnings[tool.id]['earnings'],
                    'bookings': tool_earnings[tool.id]['bookings']
                })
        
        top_tools.sort(key=lambda x: x['earnings'], reverse=True)
        
        # Booking stats
        booking_stats = {
            'activeTools': len([tool for tool in user_tools if tool.is_available]),
            'avgDailyRate': sum(tool.price_per_day for tool in user_tools) / len(user_tools) if user_tools else 0
        }
        
        return jsonify({
            'totalEarnings': total_earnings,
            'monthlyEarnings': monthly_earnings,
            'topTools': top_tools[:5],
            'earningsHistory': [],  # Would contain historical data
            'bookingStats': booking_stats
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/export', methods=['GET'])
def export_earnings_data():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        time_range = request.args.get('range', 'month')
        
        # Get user's completed bookings
        user_tools = Tool.query.filter_by(owner_id=user_id).all()
        tool_ids = [tool.id for tool in user_tools]
        
        completed_bookings = Booking.query.filter(
            Booking.tool_id.in_(tool_ids),
            Booking.status == 'completed'
        ).all()
        
        # Create CSV
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['Date', 'Tool', 'Borrower', 'Duration', 'Earnings'])
        
        # Write data
        for booking in completed_bookings:
            writer.writerow([
                booking.created_at.strftime('%Y-%m-%d'),
                booking.tool.name,
                booking.borrower.full_name or booking.borrower.username,
                f"{(booking.end_date - booking.start_date).days} days",
                f"€{booking.total_price}"
            ])
        
        output.seek(0)
        
        # Return CSV as response
        from flask import Response
        return Response(
            output.getvalue(),
            mimetype='text/csv',
            headers={'Content-Disposition': f'attachment; filename=earnings-{time_range}.csv'}
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500