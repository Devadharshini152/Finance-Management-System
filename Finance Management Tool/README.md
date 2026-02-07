**AI-Powered Personal Finance Management Platform**
**Overview**
Managing personal finances has become increasingly complex due to multiple income streams, digital payment methods, subscriptions, and evolving spending habits. Traditional budgeting applications often rely on static rules and manual categorization, offering limited insight into future financial behavior.

This project presents an AI-powered personal finance management platform that combines modern web technologies with machine learning to deliver intelligent, predictive, and personalized financial analytics. The system enables users to track income and expenses, automatically categorize transactions using Natural Language Processing (NLP), visualize financial data through interactive dashboards, and predict future spending patterns to assess overall financial health.

The platform is designed using a modular three-tier architecture, ensuring scalability, maintainability, and independent evolution of the AI components.

**System Architecture**
Three-Tier Application Design
The system is structured into three distinct layers:
**Frontend (Client Layer)**
A modern, responsive web interface for user interaction and data visualization.
**Backend (Application Layer)**
A secure RESTful API that handles business logic, authentication, and data persistence.
**Machine Learning Service (AI Layer)**
A dedicated microservice responsible for transaction categorization, predictive analytics, and financial health scoring.
This separation of concerns allows each layer to scale independently and simplifies future enhancements.

**Technology Stack
**Frontend**

React (Vite) – Fast and modern frontend framework

Tailwind CSS 4.1 – Utility-first styling for responsive UI

React Router – Client-side routing

Axios – API communication

Recharts – Interactive charts and data visualization

**Backend**

Spring Boot 3.2 (Java 21) – RESTful API development

Spring Security – JWT-based authentication and authorization

Spring Data JPA (Hibernate) – ORM and database interaction

**PostgreSQL** – Relational database for persistent storage

Maven / Gradle Wrapper – Build and dependency management

**Machine Learning Service**

FastAPI – High-performance Python API framework

Uvicorn – ASGI server

Pandas & NumPy – Data processing and numerical computation

Scikit-learn – Machine learning models

NLP-based expense classification – Automatic transaction categorization

Predictive models – Future spending estimation and trend analysis

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
