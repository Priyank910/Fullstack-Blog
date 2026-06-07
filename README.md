# Fullstack Blog

A full-stack blogging platform that allows users to create, manage, and share blog posts with image uploads, profile management, and interactive commenting.

Built using Node.js, Express.js, MongoDB, Passport.js, EJS, and Cloudinary.

---

## Features

### Authentication & Authorization

- User Registration
- User Login
- Secure Password Hashing with bcrypt
- Session-Based Authentication using Passport.js
- Protected Routes
- User Logout

### User Management

- View Personal Profile
- Edit Profile Information
- Upload Profile Picture
- Update Bio
- Delete Account

### Blog Posts

- Create New Posts
- Upload Multiple Images
- View All Posts
- View Individual Post Details
- Edit Existing Posts
- Delete Posts

### Comments

- Add Comments
- Edit Own Comments
- Delete Own Comments
- Comment Authorization

### File Management

- Cloudinary Image Storage
- Multer File Upload Handling
- Multiple Image Support
- Automatic File Cleanup

---

## Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- Passport.js
- Express Session
- bcryptjs

### File Uploads

- Multer
- Cloudinary
- Multer Storage Cloudinary

### Frontend

- EJS
- Bootstrap 4
- Font Awesome

---

## Project Architecture

```bash

Fullstack-Blog
│
├── config/
│   ├── passport.js
│   ├── cloudinary.js
│   └── multer.js
│
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── postController.js
│   └── commentController.js
│
├── middlewares/
│   ├── auth.js
│   └── errorHandler.js
│
├── models/
│   ├── User.js
│   ├── Post.js
│   ├── Comment.js
│   └── File.js
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── postRoutes.js
│   └── commentRoutes.js
│
├── views/
│   └── EJS Templates
│
└── server.js
```

Database Models
User
Username
Email
Password
Bio
Profile Picture
Post
Title
Content
Author
Images
Comments
Comment
Content
Author
Post
File
URL
Cloudinary Public ID
Uploaded By
Installation
Clone Repository
git clone https://github.com/Priyank910/Fullstack-Blog.git
Navigate Into Project
cd Fullstack-Blog
Install Dependencies
npm install
Environment Variables

Create a .env file in the root directory.

PORT=3000

MONGODB_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET=your_secret

SESSION_SECRET=your_secret_key
Run Application
npm start

Server runs on:

http://localhost:3000
Key Learning Outcomes
MVC Architecture
Authentication & Authorization
Session Management
Cloud Storage Integration
File Upload Handling
MongoDB Relationships
CRUD Operations
Middleware Implementation
Error Handling
Future Enhancements
Rich Text Editor
Like & Reaction System
Search Functionality
Categories & Tags
Bookmark Posts
Email Verification
Password Reset
Admin Dashboard
REST API Version
Screenshots

Add screenshots here:

Home Page
User Profile
Create Post
Post Details
Comments Section
Author

Priyank Chavda

GitHub: https://github.com/Priyank910

License

This project is licensed under the MIT License.

