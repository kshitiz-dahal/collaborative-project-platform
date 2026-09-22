# SyncForge

> **Collaborate. Track. Ship.**

SyncForge is a real-time collaborative project management platform that enables teams to create projects, manage tasks, collaborate through comments, track activity, and receive real-time notifications.

The platform is built as a full-stack application using React, Node.js, Express, MongoDB, and Socket.IO, with JWT-based authentication and role-based authorization.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io&logoColor=white)](https://socket.io/)

**Live Demo:** https://collaborative-project-platform.vercel.app

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [How Real-Time Collaboration Works](#how-real-time-collaboration-works)
- [Authentication & Authorization](#authentication--authorization)
- [API Overview](#api-overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Challenges & Engineering Decisions](#challenges--engineering-decisions)
- [Future Improvements](#future-improvements)
- [Demo](#demo)
- [Author](#author)

## Overview

Managing collaborative projects often requires switching between task management, communication, and activity tracking tools.

SyncForge brings these workflows into a single platform where team members can:

- Create and manage projects
- Add and manage project members
- Create, assign, update, and delete tasks
- Organize tasks using a Kanban-style board
- Search and filter tasks
- Add, edit, and delete comments
- Track project activity
- Receive notifications
- Collaborate in real time without manually refreshing the page

## Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Protected API routes
- Role-based project permissions
- Owner-only project management operations

### 📁 Project Management
- Create, edit, and delete projects
- Add and remove project members
- Project member access control
- Project progress tracking

### ✅ Task Management
- Create, update, and delete tasks
- Assign tasks to project members
- Task priorities
- Task due dates
- Todo, In Progress, and Completed states
- Drag-and-drop Kanban board
- Search and filtering

### 💬 Collaboration
- Task comments
- Edit and delete comments
- Project activity feed
- Real-time task updates
- Real-time comment updates

### 🔔 Notifications
- Task assignment notifications
- Task update notifications
- Member activity notifications
- Comment notifications
- Real-time notification delivery
- Read/unread notification state

### ⚡ Real-Time Collaboration
- Socket.IO-based communication
- Project-specific rooms
- Real-time task synchronization
- Real-time comments
- Real-time notifications
- Multi-user collaboration without page refreshes

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- Socket.IO Client

### Backend
- Node.js
- Express.js
- Socket.IO
- JWT
- bcrypt

### Database
- MongoDB
- MongoDB Atlas
- Mongoose

### Deployment
- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

## System Architecture

SyncForge follows a client-server architecture with a React frontend communicating with a Node.js/Express backend through REST APIs and Socket.IO.

```text
                         ┌──────────────────────────┐
                         │       SyncForge UI       │
                         │      React + Vite        │
                         └────────────┬─────────────┘
                                      │
                         ┌────────────┴─────────────┐
                         │                          │
                    REST API                    Socket.IO
                         │                          │
                         ▼                          ▼
              ┌─────────────────────────────────────────┐
              │          Node.js + Express Backend       │
              │                                         │
              │  Authentication & Authorization          │
              │  Project Management                      │
              │  Task Management                         │
              │  Comments                                │
              │  Notifications                           │
              │  Activity Tracking                       │
              │  Socket.IO Event Handling                │
              └───────────────────┬─────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │      MongoDB Atlas      │
                    │                         │
                    │  Users                  │
                    │  Projects               │
                    │  Tasks                  │
                    │  Comments               │
                    │  Activities             │
                    │  Notifications          │
                    └─────────────────────────┘

## Authentication & Authorization

SyncForge uses JWT-based authentication to protect user accounts and API endpoints.

### Authentication Flow

```text
┌──────────────┐
│    Client    │
└──────┬───────┘
       │
       │ Login credentials
       ▼
┌──────────────────────┐
│   Express API        │
│                      │
│ Validate credentials │
│ Hash verification    │
└──────────┬───────────┘
           │
           │ Valid
           ▼
┌──────────────────────┐
│      JWT Token       │
└──────────┬───────────┘
           │
           │ Stored by client
           ▼
┌──────────────────────┐
│ Authenticated Client │
└──────────┬───────────┘
           │
           │ Authorization header
           ▼
┌──────────────────────┐
│ Authentication       │
│ Middleware           │
│                      │
│ Verify JWT           │
│ Identify user        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Protected Controller │
└──────────────────────┘

## API Overview

The backend exposes RESTful API endpoints organized around the main application resources.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |
| POST | `/api/auth/logout` | Logout the current user |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | Get user's projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/:projectId` | Get project details |
| PUT | `/api/projects/:projectId` | Update a project |
| DELETE | `/api/projects/:projectId` | Delete a project |

### Members

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/projects/:projectId/members` | Add a project member |
| DELETE | `/api/projects/:projectId/members/:userId` | Remove a project member |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/projects/:projectId/tasks` | Create a task |
| GET | `/api/projects/:projectId/tasks` | Get project tasks |
| GET | `/api/tasks/:taskId` | Get task details |
| PUT | `/api/projects/:projectId/tasks/:taskId` | Update a task |
| DELETE | `/api/projects/:projectId/tasks/:taskId` | Delete a task |

### Comments

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tasks/:taskId/comments` | Create a comment |
| GET | `/api/tasks/:taskId/comments` | Get task comments |
| PUT | `/api/comments/:commentId` | Update a comment |
| DELETE | `/api/comments/:commentId` | Delete a comment |

### Notifications & Activity

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notifications` | Get user notifications |
| PUT | `/api/notifications/:notificationId/read` | Mark a notification as read |
| PUT | `/api/notifications/read-all` | Mark all notifications as read |
| GET | `/api/projects/:projectId/activities` | Get project activity |

## Project Structure

The repository is organized into separate frontend and backend applications.

```text
collaborative-project-platform/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   └── axios.js
│   │   │
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── activity/
│   │   │   ├── layout/
│   │   │   ├── projects/
│   │   │   ├── tasks/
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── NotificationContext.jsx
│   │   │   └── ProjectContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProjectDetailsPage.jsx
│   │   │   ├── ProjectsPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   ├── layout.css
│   │   │   ├── projects.css
│   │   │   └── tasks.css
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── socket.js
│   │
│   ├── .env.example
│   ├── vercel.json
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── activity.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── comment.controller.js
│   │   │   ├── notification.controller.js
│   │   │   ├── project.controller.js
│   │   │   └── task.controller.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── validateLogin.js
│   │   │   ├── validateRegistration.js
│   │   │   └── validation.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── Activity.js
│   │   │   ├── Comment.js
│   │   │   ├── Notification.js
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   └── User.js
│   │   │
│   │   ├── routes/
│   │   │   ├── activity.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── comment.routes.js
│   │   │   ├── notification.routes.js
│   │   │   ├── project.routes.js
│   │   │   └── task.routes.js
│   │   │
│   │   ├── services/
│   │   │   ├── activity.service.js
│   │   │   ├── auth.service.js
│   │   │   ├── comment.service.js
│   │   │   ├── notification.service.js
│   │   │   ├── project.service.js
│   │   │   └── task.service.js
│   │   │
│   │   ├── utils/
│   │   │   └── jwt.js
│   │   │
│   │   ├── validators/
│   │   │   └── task.validator.js
│   │   │
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── socket.js
│   │   ├── socketManager.js
│   │   └── test-socket.js
│   │
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md

## Getting Started

Follow these steps to run SyncForge locally.

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB or a MongoDB Atlas account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/kshitiz-dahal/collaborative-project-platform.git
cd collaborative-project-platform

### 2. Backend setup

Open a terminal in the project root and navigate to the backend:

```bash
cd backend
npm install

### 3. Frontend setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
npm install

---

## Deployment

SyncForge is deployed using the following services:

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

### Production URLs

- **Frontend:** https://collaborative-project-platform.vercel.app
- **Backend API:** https://collaborative-project-platform.onrender.com
- **API Health Check:** https://collaborative-project-platform.onrender.com/api/health

The frontend communicates with the production backend through the configured `VITE_API_URL` environment variable.

---

## Challenges & Engineering Decisions

Building SyncForge involved solving several practical full-stack engineering problems.

### Real-Time Collaboration

A major requirement was allowing multiple users to see project changes without refreshing the page.

Socket.IO was used alongside the REST API to handle real-time communication. Project-specific rooms allow events to be delivered to users participating in the same project.

### Authentication & Authorization

JWT authentication was implemented to protect API endpoints.

Authorization checks are performed on the backend for operations such as:

- Updating and deleting projects
- Adding and removing project members
- Deleting tasks
- Editing and deleting comments

These checks ensure that users cannot bypass permission restrictions by directly calling protected API endpoints.

### Keeping Real-Time State Consistent

The frontend maintains local task, comment, activity, and notification state while listening for Socket.IO events.

When another user performs an operation, the corresponding event updates the UI without requiring a page refresh.

### Production Deployment

The application is split into independently deployed frontend and backend services.

The React frontend is deployed on Vercel, while the Node.js backend runs on Render and connects to MongoDB Atlas.

The deployment process also required configuring SPA routing so that refreshing application routes does not result in a 404 response.

### Error Handling

The application handles expected API errors and authorization failures.

For example, unauthorized task deletion requests return a `403 Forbidden` response from the backend while the frontend displays an appropriate error without crashing.

---

## Future Improvements

Possible future improvements include:

- More granular project roles and permissions
- File attachments for tasks and comments
- Email notifications
- Automated testing and CI/CD
- Performance optimization for larger projects
- Pagination for large task, activity, and notification datasets
- More advanced project analytics and reporting
- Improved conflict handling for simultaneous edits
- Enhanced search and filtering capabilities

---

## Demo

### Live Application

**Frontend:**  
https://collaborative-project-platform.vercel.app

**Backend API:**  
https://collaborative-project-platform.onrender.com

### Projects Dashboard

![Projects Dashboard](https://github.com/user-attachments/assets/9c07a35c-b014-4a56-bf7f-ac761d2e5ac1)

### Collaborative Task Board

![Collaborative Task Board](https://github.com/user-attachments/assets/8fe603f0-e893-4a87-8d76-9195437d61ad)

### Task Details & Comments

![Task Details and Comments](https://github.com/user-attachments/assets/8f71e22d-1d6d-4045-a2b1-62423e9cd143)

### Notifications

![Notifications](https://github.com/user-attachments/assets/7f7bc794-444c-4f36-940d-77d67a098dc0)

---

## Author

**Kshitiz Dahal**

Computer Science Engineering Student  
Chandigarh University

- GitHub: https://github.com/kshitiz-dahal
- LinkedIn: Add your LinkedIn profile URL

---

## License

This project is developed as a portfolio and academic project.
