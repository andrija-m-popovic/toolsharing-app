# ToolShare - Peer-to-Peer Tool Sharing Platform

A comprehensive web application that enables users to share tools within their local community, built with React frontend and Flask backend.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure registration and login system with session management
- **Tool Listings**: Create, edit, and manage tool listings with detailed descriptions and images
- **Search & Browse**: Advanced search functionality with category filtering and sorting options
- **Booking System**: Complete rental workflow with date selection and pricing
- **Review System**: Rate and review tools and users to build community trust
- **Responsive Design**: Optimized for both desktop and mobile devices

### User Experience
- **Intuitive Interface**: Clean, modern design with easy navigation
- **Real Tool Images**: High-quality photos of actual tools across multiple categories
- **Location-Based**: Focused on local community sharing in Niš, Serbia
- **Flexible Pricing**: Hourly, daily, and weekly rental options
- **Security Deposits**: Built-in security deposit system for tool protection

### Technical Features
- **RESTful API**: Comprehensive backend API with full CRUD operations
- **Database Integration**: SQLite database with SQLAlchemy ORM
- **CORS Support**: Cross-origin resource sharing for frontend-backend communication
- **Session Management**: Secure user session handling
- **Error Handling**: Comprehensive error handling and validation

## 🛠 Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing for single-page application
- **CSS3**: Custom styling with responsive design
- **Fetch API**: HTTP client for backend communication

### Backend
- **Flask**: Lightweight Python web framework
- **SQLAlchemy**: Object-relational mapping for database operations
- **Flask-CORS**: Cross-origin resource sharing support
- **SQLite**: Embedded database for development and deployment

### Development Tools
- **Vite**: Fast build tool and development server
- **Python 3.11**: Latest Python version with enhanced performance
- **Git**: Version control system

## 📁 Project Structure

```
tool-sharing-app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React context providers
│   │   ├── assets/         # Static assets and images
│   │   └── App.jsx         # Main application component
│   ├── public/             # Public static files
│   └── package.json        # Frontend dependencies
├── backend/                 # Flask backend application
│   ├── src/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API route handlers
│   │   └── main.py         # Flask application entry point
│   ├── populate_db.py      # Database population script
│   └── requirements.txt    # Backend dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tool-sharing-app
   ```

2. **Set up the backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python populate_db.py  # Initialize database with sample data
   python src/main.py     # Start the Flask server
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev           # Start the development server
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Sample Login Credentials
- Email: `john@example.com`, Password: `password123`
- Email: `maria@example.com`, Password: `password123`
- Email: `stefan@example.com`, Password: `password123`

## 📊 Database Schema

### Users Table
- User authentication and profile information
- Location-based user management
- Verification status tracking

### Tools Table
- Comprehensive tool information with categories
- Pricing structure (hourly, daily, weekly)
- Availability and condition tracking
- Security deposit management

### Categories Table
- Tool categorization system
- Power Tools, Hand Tools, Garden Tools, Construction Tools, Automotive Tools

### Bookings Table
- Complete rental workflow management
- Status tracking (pending, confirmed, active, completed, cancelled)
- Date range and pricing calculations

### Reviews Table
- Dual review system for tools and users
- Rating system (1-5 stars)
- Comment and feedback management

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Tools
- `GET /api/tools` - List all tools with filtering
- `GET /api/tools/{id}` - Get specific tool details
- `POST /api/tools` - Create new tool listing
- `PUT /api/tools/{id}` - Update tool listing
- `DELETE /api/tools/{id}` - Delete tool listing

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/{id}/tools` - Get tools by category

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - List user bookings
- `PUT /api/bookings/{id}/status` - Update booking status

### Reviews
- `POST /api/reviews` - Create new review
- `GET /api/reviews/tool/{id}` - Get tool reviews
- `GET /api/reviews/user/{id}` - Get user reviews

## 🎨 Design Features

### Visual Design
- Modern, clean interface with intuitive navigation
- Consistent color scheme and typography
- High-quality tool images across all categories
- Responsive grid layouts for tool browsing

### User Experience
- Streamlined registration and login process
- Advanced search with multiple filter options
- Clear booking workflow with date selection
- Comprehensive user dashboard for managing tools and bookings

### Mobile Responsiveness
- Optimized layouts for mobile devices
- Touch-friendly interface elements
- Responsive navigation menu
- Mobile-optimized image galleries

## 🔒 Security Features

### Authentication
- Secure password hashing
- Session-based authentication
- Protected API endpoints
- User verification system

### Data Protection
- Input validation and sanitization
- SQL injection prevention through ORM
- CORS configuration for secure cross-origin requests
- Error handling without sensitive information exposure

## 🌍 Deployment

### Development Deployment
The application is configured for easy local development with hot reloading and debugging enabled.

### Production Deployment
For production deployment, consider:
- Environment variable configuration
- Database migration to PostgreSQL or MySQL
- Static file serving optimization
- SSL certificate implementation
- Load balancing for high traffic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Tool images sourced from various manufacturers and suppliers
- Community feedback and testing
- Open source libraries and frameworks used in development

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

---

**Built with ❤️ for the Niš community**

