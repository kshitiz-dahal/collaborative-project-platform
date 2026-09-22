# SyncForge

> Collaborate. Track. Ship.

SyncForge is a real-time collaborative project management platform that enables teams to create projects, manage tasks, collaborate through comments, track activity, and receive real-time notifications.

The platform is built as a full-stack application using React, Node.js, Express, MongoDB, and Socket.IO, with JWT-based authentication and role-based authorization.

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
