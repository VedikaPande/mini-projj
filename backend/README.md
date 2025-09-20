# Mind Support Backend

This is the backend for the Mind Support application. It provides authentication APIs and MongoDB integration.

## Setup and Running

1. Install dependencies:
   ```
   npm install
   ```

2. Set up MongoDB:
   - Make sure MongoDB is installed and running on your machine
   - Or use MongoDB Atlas cloud service

3. Configure environment variables:
   - Check `.env` file and update as needed:
     - PORT: Server port (default: 5000)
     - MONGODB_URI: MongoDB connection string
     - JWT_SECRET: Secret key for JWT tokens
     - JWT_EXPIRE: Token expiry period

4. Run the server:
   - For development with auto-reload:
     ```
     npm run dev
     ```
   - For production:
     ```
     npm start
     ```

## API Endpoints

### Authentication

- **Register a new user**
  - POST `/api/auth/register`
  - Body: `{ "name": "User Name", "email": "user@example.com", "password": "password123" }`

- **Login**
  - POST `/api/auth/login`
  - Body: `{ "email": "user@example.com", "password": "password123" }`

- **Get current user**
  - GET `/api/auth/me`
  - Headers: `Authorization: Bearer YOUR_TOKEN`

## Authentication

The API uses JWT (JSON Web Token) authentication. For protected routes, include the token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN
```