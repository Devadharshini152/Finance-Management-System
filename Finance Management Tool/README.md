**AI-Powered Personal Finance Management Platform**
**Overview**
Personal financial management has become increasingly complex due to diverse income sources, digital transactions, and dynamic spending patterns. Traditional budgeting tools often lack intelligent insights, predictive capabilities, and personalization.

This project implements an AI-powered personal finance management platform that enables users to:
Track income and expenses
Automatically categorize transactions using NLP
Visualize financial data through interactive dashboards
Predict future spending patterns
Assess overall financial health
The system follows a modular three-tier architecture, integrating a modern frontend, a secure backend, and a dedicated machine-learning service to deliver scalable and intelligent financial analytics.

**System Architecture**
Three-Tier Application Design
Frontend: React + Tailwind CSS
Backend: Spring Boot (REST API, JWT security)
ML Service: Python FastAPI (NLP & predictive analytics)
Database: PostgreSQL
This separation ensures scalability, maintainability, and independent evolution of AI components.

**Technology Stack
Frontend**
React (Vite)
Tailwind CSS 4.1
React Router
Axios
Recharts
**Backend**
Spring Boot 3.2 (Java 21)
Spring Security (JWT Authentication)
Spring Data JPA (Hibernate)
**PostgreSQL**
Maven / Gradle Wrapper
**Machine Learning Service**
FastAPI
Uvicorn
Pandas, NumPy
Scikit-learn
NLP-based expense classification
Spending prediction models

**Features**
Secure user authentication (JWT-based)
Income and expense management (CRUD)
Automated expense categorization using NLP
Predictive analytics for future spending
Financial health scoring
Interactive charts and dashboards
Modular microservice-style architecture

Project Structure
├── backend/        # Spring Boot REST API
├── frontend/       # React + Tailwind UI
├── ml-service/     # FastAPI ML service
└── README.md
