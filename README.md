# MERN Stack Admin Dashboard

A full-featured admin dashboard built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- Admin authentication with JWT
- Agent management (CRUD operations)
- CSV/XLSX/XLS file upload and processing
- Automatic distribution of entries to agents
- Responsive dashboard interface

## Project Structure

```
├── backend/           # Express.js backend
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Custom middleware
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   └── uploads/      # Temporary file upload directory
│
└── frontend/         # React.js frontend
    ├── public/       # Static files
    └── src/          # Source files
        ├── components/   # Reusable components
        ├── pages/       # Page components
        ├── context/     # React context
        ├── utils/       # Utility functions
        └── services/    # API services
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd ../frontend
   npm start
   ```

## API Endpoints

### Authentication
- POST /api/auth/login - Admin login

### Agents
- GET /api/agents - Get all agents
- POST /api/agents - Create new agent
- PUT /api/agents/:id - Update agent
- DELETE /api/agents/:id - Delete agent

### File Upload
- POST /api/upload - Upload CSV/XLSX/XLS file
- GET /api/entries - Get distributed entries

## Technologies Used

- Frontend:
  - React.js
  - React Router
  - Axios
  - Material-UI
  - React-toastify

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT
  - Multer
  - XLSX
  - Bcrypt

## License

MIT 