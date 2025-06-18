# Tool Sharing App - Database Schema Design

## Database Models

### 1. User Model
- id (Primary Key)
- username (Unique)
- email (Unique)
- password_hash
- full_name
- profile_picture_url
- phone_number
- location
- is_verified
- created_at
- updated_at

### 2. Tool Model
- id (Primary Key)
- owner_id (Foreign Key to User)
- category_id (Foreign Key to Category)
- name
- brand_model
- description
- condition
- price_per_hour
- price_per_day
- price_per_week
- security_deposit
- pickup_delivery_options
- is_available
- created_at
- updated_at

### 3. ToolImage Model
- id (Primary Key)
- tool_id (Foreign Key to Tool)
- image_url
- is_primary
- created_at

### 4. Category Model
- id (Primary Key)
- name
- description
- icon_url

### 5. Booking Model
- id (Primary Key)
- tool_id (Foreign Key to Tool)
- borrower_id (Foreign Key to User)
- lender_id (Foreign Key to User)
- start_date
- end_date
- total_price
- security_deposit
- status (pending, confirmed, active, completed, cancelled)
- pickup_delivery_method
- created_at
- updated_at

### 6. Review Model
- id (Primary Key)
- booking_id (Foreign Key to Booking)
- reviewer_id (Foreign Key to User)
- reviewee_id (Foreign Key to User)
- tool_id (Foreign Key to Tool)
- rating (1-5)
- comment
- review_type (tool_review, user_review)
- created_at

### 7. Message Model
- id (Primary Key)
- booking_id (Foreign Key to Booking)
- sender_id (Foreign Key to User)
- receiver_id (Foreign Key to User)
- content
- is_read
- created_at

## API Endpoints Structure

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/profile
- PUT /api/auth/profile

### Users
- GET /api/users/{id}
- PUT /api/users/{id}
- GET /api/users/{id}/tools
- GET /api/users/{id}/reviews

### Tools
- GET /api/tools (with search, filter, pagination)
- POST /api/tools
- GET /api/tools/{id}
- PUT /api/tools/{id}
- DELETE /api/tools/{id}
- POST /api/tools/{id}/images
- DELETE /api/tools/{id}/images/{image_id}

### Categories
- GET /api/categories

### Bookings
- GET /api/bookings (user's bookings)
- POST /api/bookings
- GET /api/bookings/{id}
- PUT /api/bookings/{id}
- DELETE /api/bookings/{id}

### Reviews
- GET /api/reviews/tool/{tool_id}
- GET /api/reviews/user/{user_id}
- POST /api/reviews
- PUT /api/reviews/{id}
- DELETE /api/reviews/{id}

### Messages
- GET /api/messages/booking/{booking_id}
- POST /api/messages
- PUT /api/messages/{id}/read

