# Finance Manager – Frontend

React 18 + Vite + Tailwind CSS 4.1. Organized with barrel exports and a single entry for config, context, components, pages, services, and styles.

## Structure

```
src/
├── assets/              # Static assets (images, icons)
├── components/           # Reusable UI
│   ├── auth/             # PrivateRoute
│   ├── common/           # Navbar, Loader
│   ├── transactions/     # TransactionForm
│   └── index.js          # Barrel: PrivateRoute, Navbar, Loader, TransactionForm
├── config/               # App config & constants
│   └── index.js          # ROUTES, API_BASE_URL
├── context/              # React context
│   ├── AuthContext.jsx
│   └── index.js          # AuthProvider, useAuth
├── hooks/                # Custom hooks
│   └── index.js          # useAuth (re-export from context)
├── pages/                # Route-level pages
│   ├── HomePage.jsx, LoginPage.jsx, RegisterPage.jsx
│   ├── DashboardPage.jsx, TransactionsPage.jsx, BudgetsPage.jsx, PredictionsPage.jsx
│   └── index.js          # Barrel: all pages
├── services/             # API clients
│   ├── api.js            # Axios instance + interceptors
│   ├── authService.js, transactionService.js, budgetService.js, etc.
│   └── index.js          # Barrel: all service functions
├── styles/               # Global styles
│   ├── index.css         # Tailwind + base styles
│   └── app.css           # #root, app-level overrides
├── utils/                # Helpers
│   ├── formatters.js     # formatCurrency, formatDate, formatMonth
│   └── index.js          # Barrel
├── App.jsx
└── main.jsx              # Imports styles + App
```

## Imports

- **App:** `./context`, `./components`, `./pages`
- **Pages:** `../context`, `../components`, `../services`, `../utils`
- **Components:** `../../context`, `../../services` (as needed)
- **API base URL:** `config` (used in `services/api.js`)

## Scripts

- `npm run dev` – Dev server (Vite)
- `npm run build` – Production build
- `npm run preview` – Preview production build

## Env

- `VITE_API_URL` – Backend API base URL (default: `http://localhost:8080/api`)
