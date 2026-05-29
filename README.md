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

**🏗️ System Architecture**

HireMind AI follows a standard full-stack client–server architecture with a clear separation between frontend, backend, and AI/database services.

The frontend (React) is responsible for the user interface. It handles user interactions such as login, dashboard view, resume upload, and AI interview sessions. It communicates with the backend through REST APIs using HTTP requests secured with JWT authentication.

The backend (Node.js + Express) acts as the core logic layer of the application. It manages user authentication, interview creation, AI-based question generation, answer evaluation, and storing interview data. All requests from the frontend are processed here, validated using middleware, and then routed to the appropriate controllers.

The database layer (MongoDB Atlas) is used to store all persistent data such as user information, interview records, scores, and authentication tokens. Mongoose is used as the ODM to structure and manage database operations.

The AI service layer (Groq LLaMA model) is integrated into the backend. It is responsible for generating interview questions, evaluating user answers, and providing performance feedback. The backend sends prompts to the AI model and receives structured responses.

The system works in the following flow:

User interacts with the React frontend
Frontend sends API requests to the backend
Backend validates requests using JWT authentication
Backend communicates with MongoDB for data storage
Backend sends prompts to Groq AI for question generation and evaluation
AI response is processed and sent back to frontend
Frontend displays results to the user in real time

This layered architecture ensures:

Clear separation of responsibilities
Scalable backend design
Secure authentication flow
Efficient AI integration
Smooth and responsive user experience

**Project Structure**
# 📁 Project Structure

## 🧠 Backend (Core Engine)
- config → Database & AI configuration
- controllers → Business logic (auth, AI, interview, user)
- middleware → Auth, error handling, uploads
- models → MongoDB schemas (User, Interview, RefreshToken)
- routes → API endpoints
- services → AI logic, JWT, resume processing
- utils → helpers (token, logger, hashing)
- uploads → resume storage
- app.js → Express app setup
- server.js → server entry point

---

## 🎨 Frontend (User Interface)
- public → static assets
- src/assets → images, icons
- src/components
  - common → reusable components
  - layout → page layout components
  - ui → buttons, cards, inputs
- src/pages
  - auth → login/register
  - dashboard → analytics & history
  - interview → AI interview flow
  - profile → user settings
- src/routes → app routing system
- src/services → API calls
- src/utils → helpers & axios config
- src/context → global state (Auth)
- src/hooks → custom hooks
- App.jsx → main app
- main.jsx → entry point


**🚀 Getting Started**
📌 Prerequisites
Before running this project, make sure you have:
Node.js v18+
MongoDB Atlas account
Groq API Key
Google OAuth credentials

**Backend**
cd backend
npm install
npm run dev
**Frontend**
cd frontend
npm install
npm run dev

**Environment Variables**
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

**📡 API Reference**
**🔐 Authentication Routes**
| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |
| POST   | `/api/auth/google`   | Google login      |
| POST   | `/api/auth/refresh`  | Refresh token     |
| POST   | `/api/auth/logout`   | Logout user       |

**🤖 AI Routes**
| Method | Endpoint                  | Description        |
| ------ | ------------------------- | ------------------ |
| POST   | `/api/ai/start-interview` | Start AI interview |
| POST   | `/api/ai/evaluate-answer` | Evaluate answer    |

**📊 Interview Routes**
| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | `/api/interviews`     | Get all interviews  |
| GET    | `/api/interviews/:id` | Get interview by ID |


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

Prakriti Kumari,
Kumari Shivani Mahato,
Pragati Kumari

Final Year Project — BCA (2023–2026)
Netaji Subhas University

**Conclusion**

HireMind AI demonstrates a real-world implementation of AI-driven interview preparation combining modern full-stack engineering, scalable architecture, and intelligent feedback systems.

🔥 Built with React, Node.js, MongoDB, and Groq AI