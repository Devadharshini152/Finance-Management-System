import api from './api';

export const getTransactions = (params = {}) =>
  api.get('/transactions', { params }).then((r) => r.data);

export const getTransaction = (id) =>
  api.get(`/transactions/${id}`).then((r) => r.data);

export const createTransaction = (body) =>
  api.post('/transactions', body).then((r) => r.data);

export const updateTransaction = (id, body) =>
  api.put(`/transactions/${id}`, body).then((r) => r.data);

export const deleteTransaction = (id) =>
  api.delete(`/transactions/${id}`).then((r) => r.data);
