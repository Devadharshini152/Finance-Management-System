import api from './api';

export const getBudgets = () => api.get('/budgets').then((r) => r.data);

export const getBudgetStatus = (month) =>
  api.get('/budgets/status', { params: month ? { month } : {} }).then((r) => r.data);

export const getBudget = (id) => api.get(`/budgets/${id}`).then((r) => r.data);

export const createBudget = (body) => api.post('/budgets', body).then((r) => r.data);

export const updateBudget = (id, body) => api.put(`/budgets/${id}`, body).then((r) => r.data);

export const deleteBudget = (id) => api.delete(`/budgets/${id}`).then((r) => r.data);
