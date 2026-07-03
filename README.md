# Focus Board

A full-stack task manager with JWT authentication and priority-based task tracking, built with the MERN stack.

## Features

- **Secure authentication** — signup and login with hashed passwords (bcrypt) and JWT-based sessions
- **Task CRUD** — create, edit, delete, and mark tasks complete
- **Priority tracking** — tag tasks Low / Medium / High
- **Filtering & sorting** — filter by priority or completion status, sort by priority or date
- **Protected routes** — dashboard is only accessible when logged in
- **Custom-designed UI** — React + Tailwind frontend


## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router, Axios
**Backend:** Node.js, Express
**Database:** MongoDB with Mongoose
**Auth:** JWT + bcrypt

## Getting Started

### Backend

cd server
npm install

Create a `.env` file in `server/`:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Then run:

npm run dev

Runs on http://localhost:5000

### Frontend

In a new terminal:

cd client
npm install
npm run dev

Runs on http://localhost:5173

## API Endpoints

POST   /api/auth/signup
POST   /api/auth/login
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
PATCH  /api/tasks/:id/toggle

All task routes require an Authorization: Bearer <token> header.




