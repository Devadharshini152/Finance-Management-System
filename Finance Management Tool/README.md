# AI-Powered Personal Finance Management Platform

Personal financial management has become increasingly complex due to diverse income sources, digital transactions, and dynamic spending patterns. Traditional budgeting tools often lack intelligent insights, predictive capabilities, and personalized financial guidance. This project presents the design and development of an AI-powered personal finance management platform that enables users to efficiently track income and expenses, receive personalized financial recommendations, and predict future financial trends. The proposed system integrates machine learning, natural language processing (NLP), and real-time financial data APIs to deliver automated expense categorization, predictive analytics, and dynamic budget optimization. Users can securely input or synchronize financial data, which is processed and stored in a PostgreSQL database through a scalable Spring Boot backend. The frontend, developed using React, provides an intuitive and interactive user experience for financial monitoring and insights visualization. A dedicated Python-based machine learning service handles advanced analytics, including NLP-based expense classification and predictive models that forecast future spending patterns. These models analyze historical financial data to provide actionable insights, enabling users to make informed financial decisions. Real-time data integration enhances accuracy and relevance, while dynamic budget adjustments adapt to changing user behavior and financial conditions. The system emphasizes scalability, security, and modular architecture, ensuring seamless interaction between frontend, backend, and AI components. By combining intelligent automation with predictive financial analytics, this platform aims to improve financial awareness, optimize budgeting behavior, and empower users with data-driven financial decision-making.

Three-tier application: **React** (Tailwind 4.1) frontend, **Spring Boot** backend, **Python FastAPI** ML service. Database: **PostgreSQL** (`tcsion`, user: `postgres`, password: `admin`).

## Quick Start

### 1. PostgreSQL
- Create database: `CREATE DATABASE tcsion;`
- Ensure it runs on `localhost:5432` with user `postgres` / password `admin`.

### 2. Backend (Spring Boot, port 8080)
```bash
cd backend
./gradlew bootRun
```
- API docs: http://localhost:8080/swagger-ui.html
- JWT auth: `POST /api/auth/register` or `POST /api/auth/login`.

### 3. ML Service (FastAPI, port 8000)
```bash
cd ml-service
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- Docs: http://localhost:8000/docs
- Endpoints: `/health`, `/classify`, `/predict`, `/health-score`.

### 4. Frontend (Vite + React, port 5173)
```bash
cd frontend
npm install
npm run dev
```
- Open http://localhost:5173 — register or login, then use Dashboard, Transactions, Budgets, Predictions.

## Project Layout
- **backend/** — Spring Boot 3.2, JWT, JPA, PostgreSQL, REST API.
- **ml-service/** — FastAPI, NLP classification, spending prediction, financial health score.
- **frontend/** — React 18, React Router, Tailwind 4.1, Recharts, Axios.

## Env (optional)
- Backend: `JWT_SECRET` (min 256-bit for HS256).
- Frontend: `VITE_API_URL` (default `http://localhost:8080/api`).
