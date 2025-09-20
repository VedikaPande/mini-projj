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

### Quizzes

- **Get all quizzes**
  - GET `/api/quizzes`
  - Headers: `Authorization: Bearer YOUR_TOKEN`

- **Get a single quiz**
  - GET `/api/quizzes/:id`
  - Headers: `Authorization: Bearer YOUR_TOKEN`

- **Submit a quiz result**
  - POST `/api/quizzes/:id/submit`
  - Headers: `Authorization: Bearer YOUR_TOKEN`
  - Body: `{ "answers": { "questionId1": "optionValue1", "questionId2": "optionValue2", ... } }`

- **Get all quiz results for the current user**
  - GET `/api/quizzes/results`
  - Headers: `Authorization: Bearer YOUR_TOKEN`

- **Get a specific quiz result for the current user**
  - GET `/api/quizzes/:id/results`
  - Headers: `Authorization: Bearer YOUR_TOKEN`

## Database Seeding

To seed the database with initial quiz data:

```
npm run seed
```

To remove all quiz data:

```
npm run seed:delete
```

## Groq API Integration

The quiz API integrates with Groq to provide personalized mental health recommendations based on quiz results. To use this feature:

1. Get a Groq API key from https://console.groq.com/
2. Add your API key to the `.env` file:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

## Authentication

The API uses JWT (JSON Web Token) authentication. For protected routes, include the token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN
```