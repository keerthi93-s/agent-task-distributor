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
## Default Admin Login

After setting up the backend, use the following credentials to log in as the admin:
Email: admin@example.com  
Password: admin123
Note: 
-These credentials are created automatically when you run the init-admin.js script in the backend.
-For security, please change the password after your first login in a production environment.

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

## Final Output Screenshots
1. Login Page Output Screenshot

![image](https://github.com/user-attachments/assets/a034fc9c-47a1-4f92-b4e9-9d87a9a3db7d)

2.Dashboard Output Screenshot

![image](https://github.com/user-attachments/assets/51d15f8b-c0ad-451a-8f28-ee3dae7870b9)

3. Dashboard Output Screenshot
    - agents view in admin dashboard
![image](https://github.com/user-attachments/assets/4f1d56eb-5294-48de-85ca-5b7a7b5ec890)

    -graphical representation of status distribution, number of entries per agent, Completed Entries over time in admindashboard
    
![image](https://github.com/user-attachments/assets/b1fe4d87-d095-49a0-ae9a-f506f07acc76)

4. agents component Output Screenshot

![image](https://github.com/user-attachments/assets/e4838eb1-2f7b-483a-a268-fbbcc8f0e2bb)


5. upload file Output Screenshot

![image](https://github.com/user-attachments/assets/a41f521d-d51a-4b1f-8cb3-73cfcbf2f8c8)

6. List Of All the Users Data Output Screenshot

![image](https://github.com/user-attachments/assets/04d5e0d4-e9be-4912-95fb-4dcc7156b27f)

## Demo Vedio of Agent Task Distributer Admin Dashboard

https://github.com/user-attachments/assets/a3dc8c79-c3cd-4f55-8ffc-a296472c1e7e








