import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ThemeProvider, CurrencyProvider } from './context';
import { PrivateRoute } from './components';
import {
  HomePage,
  LoginPage,
  RegisterPage,
  DashboardPage,
  TransactionsPage,
  BudgetsPage,
  PredictionsPage,
  SettingsPage,
} from './pages';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/transactions" element={<PrivateRoute><TransactionsPage /></PrivateRoute>} />
      <Route path="/budgets" element={<PrivateRoute><BudgetsPage /></PrivateRoute>} />
      <Route path="/predictions" element={<PrivateRoute><PredictionsPage /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CurrencyProvider>
            <AppRoutes />
          </CurrencyProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
