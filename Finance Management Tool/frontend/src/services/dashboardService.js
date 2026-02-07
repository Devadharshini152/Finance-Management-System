import api from './api';

export const getDashboardOverview = () =>
  api.get('/dashboard/overview').then((r) => r.data);
