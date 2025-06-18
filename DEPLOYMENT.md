# GitHub Deployment Guide

This guide provides step-by-step instructions for deploying the ToolShare application to GitHub and setting up hosting.

## 📋 Prerequisites

Before deploying to GitHub, ensure you have:
- Git installed on your local machine
- A GitHub account
- The complete ToolShare application files
- Node.js and Python installed for local testing

## 🚀 GitHub Repository Setup

### 1. Create a New Repository

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `toolshare-app` (or your preferred name)
   - **Description**: "Peer-to-peer tool sharing platform built with React and Flask"
   - **Visibility**: Choose Public or Private based on your needs
   - **Initialize**: Do NOT initialize with README, .gitignore, or license (we already have these)

### 2. Clone and Push Your Code

```bash
# Navigate to your project directory
cd tool-sharing-app

# Initialize Git repository (if not already done)
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Complete ToolShare application with React frontend and Flask backend"

# Add GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/toolshare-app.git

# Push to GitHub
git push -u origin main
```

## 🌐 Frontend Deployment Options

### Option 1: GitHub Pages (Static Hosting)

GitHub Pages is ideal for the React frontend but cannot host the Flask backend.

1. **Build the React application**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Create a gh-pages branch**:
   ```bash
   # Install gh-pages package
   npm install --save-dev gh-pages
   
   # Add deployment script to package.json
   # Add this to the "scripts" section:
   # "deploy": "gh-pages -d dist"
   
   # Deploy to GitHub Pages
   npm run deploy
   ```

3. **Configure GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch
   - Your frontend will be available at: `https://YOUR_USERNAME.github.io/toolshare-app`

### Option 2: Netlify (Recommended for Frontend)

1. **Connect to Netlify**:
   - Go to [Netlify](https://netlify.com)
   - Sign up/login with your GitHub account
   - Click "New site from Git"
   - Choose your ToolShare repository

2. **Configure Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

3. **Deploy**:
   - Netlify will automatically build and deploy your frontend
   - You'll get a custom URL like `https://amazing-app-name.netlify.app`

### Option 3: Vercel (Alternative Frontend Hosting)

1. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Sign up/login with your GitHub account
   - Import your repository

2. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

## 🖥 Backend Deployment Options

### Option 1: Heroku (Recommended)

1. **Prepare for Heroku**:
   ```bash
   # Create Procfile in backend directory
   echo "web: python src/main.py" > backend/Procfile
   
   # Update main.py to use PORT environment variable
   # Add this to the end of main.py:
   # if __name__ == '__main__':
   #     port = int(os.environ.get('PORT', 5000))
   #     app.run(host='0.0.0.0', port=port, debug=False)
   ```

2. **Deploy to Heroku**:
   ```bash
   # Install Heroku CLI
   # Create new Heroku app
   heroku create your-toolshare-backend
   
   # Set buildpack for Python
   heroku buildpacks:set heroku/python
   
   # Deploy
   git subtree push --prefix backend heroku main
   ```

### Option 2: Railway

1. **Connect to Railway**:
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub
   - Create new project from GitHub repo

2. **Configure Deployment**:
   - Select the backend folder
   - Railway will auto-detect Python and deploy
   - Set environment variables if needed

### Option 3: PythonAnywhere

1. **Upload Code**:
   - Create account at [PythonAnywhere](https://pythonanywhere.com)
   - Upload your backend files
   - Install dependencies in a virtual environment

2. **Configure Web App**:
   - Create a new web app
   - Configure WSGI file to point to your Flask app
   - Set up static files serving

## 🔧 Environment Configuration

### Frontend Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=https://your-backend-url.herokuapp.com/api
VITE_APP_NAME=ToolShare
```

Update your AuthContext to use the environment variable:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

### Backend Environment Variables

For production deployment, set these environment variables:

```env
FLASK_ENV=production
DATABASE_URL=your-production-database-url
SECRET_KEY=your-super-secret-key
CORS_ORIGINS=https://your-frontend-url.netlify.app
```

## 📊 Database Considerations

### Development Database
- SQLite is included and works for development
- Database file is created automatically when running `populate_db.py`

### Production Database
For production, consider upgrading to:
- **PostgreSQL** (recommended for Heroku)
- **MySQL** (widely supported)
- **MongoDB** (for document-based storage)

Update your Flask configuration:
```python
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
```

## 🔒 Security for Production

### 1. Environment Variables
- Never commit sensitive data to GitHub
- Use environment variables for API keys, database URLs, and secrets
- Add `.env` files to `.gitignore`

### 2. CORS Configuration
Update CORS settings for production:
```python
from flask_cors import CORS

# In production, specify exact origins
CORS(app, origins=['https://your-frontend-domain.com'])
```

### 3. Database Security
- Use strong passwords for production databases
- Enable SSL connections
- Regular backups and monitoring

## 📈 Monitoring and Maintenance

### 1. Error Tracking
Consider integrating:
- **Sentry** for error tracking
- **LogRocket** for user session recording
- **Google Analytics** for usage analytics

### 2. Performance Monitoring
- Monitor API response times
- Track database query performance
- Set up uptime monitoring

### 3. Regular Updates
- Keep dependencies updated
- Monitor security vulnerabilities
- Regular database backups

## 🚀 Continuous Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install and Build
      run: |
        cd frontend
        npm install
        npm run build
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      with:
        args: deploy --prod --dir=frontend/dist
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: "your-toolshare-backend"
        heroku_email: "your-email@example.com"
        appdir: "backend"
```

## 📞 Support and Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for your frontend domain
2. **Database Connection**: Check database URL and credentials
3. **Build Failures**: Verify all dependencies are listed in requirements.txt/package.json
4. **Environment Variables**: Ensure all required environment variables are set

### Getting Help

- Check the main README.md for detailed setup instructions
- Review GitHub Issues for common problems
- Contact the development team for specific deployment questions

---

**Happy Deploying! 🚀**

