# Contributing to ToolShare

Thank you for your interest in contributing to ToolShare! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information** including:
   - Steps to reproduce the problem
   - Expected vs actual behavior
   - Screenshots or error messages
   - Environment details (browser, OS, etc.)

### Suggesting Features

1. **Open a feature request** issue
2. **Describe the feature** in detail
3. **Explain the use case** and benefits
4. **Consider implementation** complexity

### Code Contributions

#### Getting Started

1. **Fork the repository**
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Set up the development environment**

#### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/toolshare-app.git
cd toolshare-app

# Set up backend
cd backend
pip install -r requirements.txt
python populate_db.py
python src/main.py

# Set up frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

#### Making Changes

1. **Follow the coding standards** outlined below
2. **Write tests** for new functionality
3. **Update documentation** as needed
4. **Test your changes** thoroughly

#### Submitting Changes

1. **Commit your changes** with clear messages
2. **Push to your fork**
3. **Create a pull request** to the main repository
4. **Describe your changes** in the PR description

## 📝 Coding Standards

### Frontend (React)

- Use **functional components** with hooks
- Follow **React best practices**
- Use **meaningful component names**
- Keep components **small and focused**
- Use **TypeScript** for type safety (if applicable)

```javascript
// Good
const ToolCard = ({ tool, onBooking }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleBooking = async () => {
    setIsLoading(true);
    try {
      await onBooking(tool.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tool-card">
      {/* Component content */}
    </div>
  );
};
```

### Backend (Flask)

- Follow **PEP 8** Python style guide
- Use **descriptive function names**
- Add **docstrings** to functions and classes
- Handle **errors gracefully**
- Use **type hints** where appropriate

```python
def create_booking(tool_id: int, user_id: int, start_date: datetime, end_date: datetime) -> dict:
    """
    Create a new booking for a tool.
    
    Args:
        tool_id: ID of the tool to book
        user_id: ID of the user making the booking
        start_date: Booking start date
        end_date: Booking end date
    
    Returns:
        Dictionary containing booking information
    
    Raises:
        ValueError: If dates are invalid
        ToolNotAvailableError: If tool is not available
    """
    # Implementation here
```

### Database

- Use **descriptive table and column names**
- Follow **database naming conventions**
- Add **proper indexes** for performance
- Include **foreign key constraints**

### API Design

- Follow **RESTful conventions**
- Use **appropriate HTTP methods**
- Return **consistent response formats**
- Include **proper error messages**

```python
# Good API endpoint
@app.route('/api/tools/<int:tool_id>', methods=['GET'])
def get_tool(tool_id):
    try:
        tool = Tool.query.get_or_404(tool_id)
        return jsonify(tool.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

## 🧪 Testing

### Frontend Testing

- Write **unit tests** for components
- Test **user interactions**
- Test **API integration**

### Backend Testing

- Write **unit tests** for functions
- Test **API endpoints**
- Test **database operations**

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
python -m pytest
```

## 📚 Documentation

### Code Documentation

- Add **comments** for complex logic
- Use **clear variable names**
- Document **API endpoints**
- Update **README** when needed

### User Documentation

- Update **user guides** for new features
- Add **screenshots** for UI changes
- Keep **installation instructions** current

## 🔄 Pull Request Process

1. **Ensure your code follows** the coding standards
2. **Update tests** and documentation
3. **Rebase your branch** on the latest main
4. **Create a clear PR title** and description
5. **Link related issues** in the PR description
6. **Request review** from maintainers

### PR Title Format

```
type(scope): brief description

Examples:
feat(auth): add password reset functionality
fix(booking): resolve date validation issue
docs(readme): update installation instructions
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

## 🏷️ Versioning

We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## 📋 Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority-high`: High priority issue
- `priority-low`: Low priority issue

## 🎯 Development Priorities

### Current Focus Areas

1. **User Experience**: Improving the interface and usability
2. **Performance**: Optimizing load times and responsiveness
3. **Security**: Enhancing authentication and data protection
4. **Mobile Support**: Better mobile experience
5. **Testing**: Increasing test coverage

### Future Roadmap

- Payment integration
- Real-time notifications
- Advanced search filters
- Mobile app development
- Multi-language support

## 💬 Communication

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Email**: For security issues or private matters

### Code of Conduct

- Be **respectful** and **inclusive**
- **Help others** learn and grow
- **Focus on constructive** feedback
- **Respect different** perspectives and experiences

## 🙏 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page

## 📞 Contact

For questions about contributing:
- Open an issue for public discussion
- Contact maintainers for private matters
- Join our community discussions

---

**Thank you for contributing to ToolShare! 🛠️**

