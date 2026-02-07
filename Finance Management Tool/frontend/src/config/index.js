/**
 * App config and route paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  BUDGETS: '/budgets',
  PREDICTIONS: '/predictions',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
