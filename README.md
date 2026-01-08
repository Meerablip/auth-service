# 🔐 Auth Service

A secure authentication service built with Node.js, Express, PostgreSQL, and JWT tokens.

## Features

- ✅ User registration with email and password
- ✅ Secure login with JWT tokens
- ✅ Role-based access control (User/Admin)
- ✅ Password hashing with bcrypt
- ✅ Protected routes with middleware
- ✅ Clean frontend UI for testing

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Frontend**: Vanilla HTML/CSS/JavaScript

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/auth_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

### 3. Set Up Database

Create the database and run the schema:

```bash
# Create database (using psql)
createdb auth_db

# Or using psql command line
psql -U postgres -c "CREATE DATABASE auth_db;"

# Run the schema
psql -U postgres -d auth_db -f backend/schema.sql
```

### 4. Start the Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:3001`

### 5. Access the Frontend

Open your browser and navigate to:
```
http://localhost:3001
```

## API Endpoints

### Public Endpoints

- `POST /auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "role": "user"
  }
  ```

- `POST /auth/login` - Login and get JWT token
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Protected Endpoints

- `GET /auth/me` - Get current user info (requires JWT token)
- `GET /auth/admin` - Admin-only endpoint (requires admin role)

### Health Check

- `GET /` - Service health check
- `GET /db-check` - Database connection check

## Project Structure

```
auth-service-main/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── role.middleware.js
│   │   ├── routes/
│   │   │   └── auth.routes.js
│   │   ├── db.js
│   │   └── server.js
│   ├── package.json
│   └── schema.sql
├── public/
│   ├── index.html
│   ├── app.js
│   └── style.css
├── .env
├── .env.example
├── .gitignore
└── README.md
```

## Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT tokens with 15-minute expiration
- ✅ SQL injection protection via parameterized queries
- ✅ Role-based access control
- ✅ Environment variable protection

## Testing the Application

1. **Register a new user**: Use the Signup tab
2. **Login**: Use the Login tab with your credentials
3. **View profile**: Check the Profile tab after logging in
4. **Test admin access**: Create an admin user and check the Admin tab

## Common Issues

### Database Connection Error

- Ensure PostgreSQL is running
- Verify DATABASE_URL in `.env` is correct
- Check if the database exists

### JWT Token Error

- Ensure JWT_SECRET is set in `.env`
- Check if token is being sent in Authorization header

### Port Already in Use

- The default port is 3001 (to avoid conflict with macOS AirPlay on port 5000)
- Change PORT in `.env` if needed
- Kill the process using the port: `lsof -ti:3001 | xargs kill -9`

## License

ISC
