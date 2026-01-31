# StudyBuddy - Study Material Management System

A comprehensive web application for managing and accessing study materials, organized by subjects. Features user authentication, PDF viewing, download capabilities, and an admin portal for content management.

## Features

- **User Authentication**: Sign up and login with role-based access (students and admins)
- **Student Verification**: Only verified students can access materials
- **Subject Organization**: Materials organized by subjects in a folder-like structure
- **PDF Viewer**: Built-in PDF viewer for online reading
- **Download Functionality**: Download study materials
- **Admin Portal**: User analytics, subject management, and material uploads
- **File Storage**: Secure file storage using Supabase
- **Database**: MongoDB for user and content data

## Tech Stack

### Frontend
- React 19
- React Router DOM
- React PDF
- Axios
- React Toastify
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Supabase (file storage)
- bcryptjs (password hashing)

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or cloud)
- Supabase account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..
npm install --legacy-peer-deps
```

### 2. Database Setup

#### MongoDB
- Install MongoDB locally or use MongoDB Atlas
- Update the `MONGODB_URI` in `backend/.env`

#### Supabase
- Create a Supabase project at https://supabase.com
- Go to Settings > API to get your project URL and anon key
- Create a storage bucket called `study-materials`
- Update `SUPABASE_URL` and `SUPABASE_KEY` in `backend/.env`

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb://localhost:27017/studybuddy
JWT_SECRET=your_super_secret_jwt_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
PORT=5000
```

### 4. Create Admin User

```bash
cd backend
node createAdmin.js
```

This will create an admin user with:
- Email: admin@studybuddy.com
- Password: admin123

### 5. Start the Application

#### Backend
```bash
cd backend
npm run dev
```

#### Frontend
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Usage

### For Students
1. Register with your details
2. Wait for admin verification
3. Login to access the dashboard
4. Browse subjects and view/download materials

### For Admins
1. Login with admin credentials
2. Access the admin dashboard
3. Manage users (verify/delete)
4. Add new subjects
5. Upload study materials to subjects

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create subject (admin only)
- `GET /api/subjects/:subjectId/materials` - Get materials for a subject
- `POST /api/subjects/:subjectId/materials` - Upload material (admin only)

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId/verify` - Verify user
- `DELETE /api/admin/users/:userId` - Delete user
- `GET /api/admin/analytics` - Get analytics
- `DELETE /api/admin/subjects/:subjectId` - Delete subject

## File Structure

```
studybuddy/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Subject.js
│   │   └── Material.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── subjects.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── createAdmin.js
│   ├── package.json
│   └── .env
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── SubjectMaterials.jsx
│   │   ├── PDFViewer.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── AdminRoute.jsx
│   │   └── *.css
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── README.md
```

## Error Handling

The application includes comprehensive error handling for:
- Authentication errors
- File upload failures
- Database connection issues
- Invalid requests
- Network errors

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS protection
- Secure file storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.