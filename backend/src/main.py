import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.auth import auth_bp
from src.routes.tools import tools_bp
from src.routes.categories import categories_bp
from src.routes.bookings import bookings_bp
from src.routes.reviews import reviews_bp
from src.routes.messages import messages_bp
from src.routes.notifications import notifications_bp
from src.routes.analytics import analytics_bp
from src.routes.dashboard import dashboard_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Enable CORS for all routes
CORS(app, origins=['*'])

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(tools_bp, url_prefix='/api/tools')
app.register_blueprint(categories_bp, url_prefix='/api/categories')
app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
app.register_blueprint(messages_bp, url_prefix='/api/messages')
app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

@app.route('/api/health')
def health_check():
    return {'status': 'healthy', 'message': 'ToolShare API is running'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)