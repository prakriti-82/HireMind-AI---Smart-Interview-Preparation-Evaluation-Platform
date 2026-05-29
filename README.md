**HireMind AI 🚀 — Smart Interview Preparation & Evaluation Platform**

A full-stack AI-powered mock interview platform that simulates real interview experiences, evaluates answers using LLMs, and provides performance analytics with secure authentication and optimized backend architecture.

**Table of Contents**
Overview
Features
Tech Stack
System Architecture
Project Structure
Getting Started
Environment Variables
API Reference
Security Implementation
Performance Optimisations
Future Improvements
Author

**Overview**
HireMind AI is a full-stack AI-powered interview preparation platform designed to simulate real-world technical and HR interviews.
It helps users:

Practice AI-generated interviews based on job roles
Upload and analyze resumes
Receive instant AI feedback and scoring
Track performance over multiple interviews
Improve communication and technical clarity

The platform uses Groq’s LLaMA 3.1 models for fast inference, combined with a secure Node.js + Express backend and MongoDB database for scalable storage.

The system is designed with a strong focus on:

Clean scalable backend architecture
Secure authentication flow (JWT + refresh token rotation)
Optimized AI response pipeline
Modern responsive UI/UX

**Features**
AI Interview Engine 🤖
Role-based dynamic interview generation
Resume-driven personalized questions
Real-time AI evaluation of answers
Structured scoring (0–10) with feedback
Follow-up question generation
Auto session completion logic

**Resume Intelligence 📄**
PDF resume upload support
Text extraction using pdfreader
Skill detection for question customization
Context-aware interview flow

**Analytics Dashboard 📊**
Interview history tracking
Average score analysis
Best performance tracking
Response time analysis
AI feedback logs

**Authentication & Security 🔐**
Email/Password Authentication
bcrypt password hashing
JWT-based secure sessions
**Google OAuth**
One-tap login
Secure token verification on backend

**Token System**
15 min access tokens
7 day refresh tokens
Refresh token hashing (SHA-256)
Silent token renewal
Secure logout with token invalidation

**UI / UX Experience 🎨**
Glassmorphism modern UI design
Fully responsive layout
Animated AI chat interface
Auto-scrolling interview chat
Real-time feedback rendering
Smooth transitions and gradients
Protected routes for secure navigation

**Tech Stack**
**FRONTEND**
| Technology      | Purpose        |
| --------------- | -------------- |
| React 18        | UI framework   |
| React Router v6 | Routing        |
| Tailwind CSS    | Styling        |
| Axios           | API calls      |
| React Icons     | UI icons       |
| React Hot Toast | Notifications  |
| JWT Decode      | Token handling |
| Google OAuth    | Authentication |

**BACKEND**
| Technology         | Purpose                  |
| ------------------ | ------------------------ |
| Node.js            | Runtime                  |
| Express.js         | Backend framework        |
| MongoDB            | Database                 |
| Mongoose           | ODM                      |
| Groq SDK           | AI integration           |
| JWT                | Authentication           |
| bcryptjs           | Password hashing         |
| pdfreader          | Resume parsing           |
| multer             | File uploads             |
| compression        | Performance optimization |
| express-rate-limit | API protection           |
| cors               | Cross-origin handling    |

**AI Model**
| Model                | Purpose                                |
| -------------------- | -------------------------------------- |
| llama-3.1-8b-instant | Fast interview generation & evaluation |

**System Architecture**
┌──────────────────────── Frontend (React) ────────────────────────┐
│  Auth → Dashboard → Interview → Analytics                        │
└───────────────┬──────────────────────────────────────────────────┘
                │  JWT API Calls
                ▼
┌──────────────────────── Backend (Node.js) ────────────────────────┐
│ Express REST API                                                  │
│                                                                   │
│ /api/auth   → Authentication                                      │
│ /api/ai     → Interview generation & evaluation                  │
│ /api/user   → User profile                                         │
│ /api/interviews → Interview history                               │
│                                                                   │
│ JWT Middleware + Rate Limiting + Validation                      │
└───────────────┬──────────────────────────────────────────────────┘
                ▼
     ┌──────────────────────────────┐
     │        MongoDB Atlas         │
     │ Users | Interviews | Tokens  │
     └──────────────┬───────────────┘
                    ▼
        ┌──────────────────────────┐
        │  Groq LLaMA 3.1 AI       │
        │  - Question Generation    │
        │  - Answer Evaluation      │
        └──────────────────────────┘

**Project Structure**
hiremind-ai/
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── groqClient.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── aiController.js
│   │   ├── interviewController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Interview.js
│   │   └── RefreshToken.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── services/
│   │   ├── aiService.js
│   │   ├── jwtService.js
│   │   └── resumeService.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── hashToken.js
│   │   └── logger.js
│   │
│   ├── uploads/
│   ├── app.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── interview/
│   │   │   └── profile/
│   │   │
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── vite.config.js
│
├── .env
├── .gitignore
├── package.json
└── README.md


**Getting Started**
Prerequisites
Node.js v18+
MongoDB Atlas
Groq API Key
Google OAuth credentials
Installation
cd hiremind-ai
Backend
cd backend
npm install
npm run dev
Frontend
cd frontend
npm install
npm run dev
Environment Variables
Backend .env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
GROQ_API_KEY=your_groq_key
GOOGLE_CLIENT_ID=your_google_client_id
CLIENT_URL=http://localhost:5173
Frontend .env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id

**API Reference**
Auth
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
POST /api/auth/refresh
POST /api/auth/logout
**AI**
POST /api/ai/start-interview
POST /api/ai/evaluate-answer
**Interviews**
GET /api/interviews
GET /api/interviews/:id

**Security Implementation**
JWT authentication with refresh rotation
bcrypt password hashing
Secure HTTP-only token handling
Input validation middleware
Rate limiting on APIs
CORS protection
Safe file upload handling
Performance Optimisations
MongoDB indexing + lean queries
Response caching for tokens
Compression middleware
Reduced AI token usage
Optimized frontend rendering
Lazy-loaded routes

**Future Improvements**
Voice-based interviews 🎤
Video interview simulation 📹
AI emotion detection 😄
Multi-language support 🌐
Admin dashboard 📊
Interview recording system

Author

**Team Members**

Prakriti Kumari
Kumari Shivani Mahato
Pragati Kumari

Final Year Project — BCA (2023–2026)
Netaji Subhas University

**Conclusion**

HireMind AI demonstrates a real-world implementation of AI-driven interview preparation combining modern full-stack engineering, scalable architecture, and intelligent feedback systems.

🔥 Built with React, Node.js, MongoDB, and Groq AI