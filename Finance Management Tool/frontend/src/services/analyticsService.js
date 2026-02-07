import api from './api';

export const getBudgetRecommendations = () =>
    api.get('/analytics/budget-recommendations').then(r => r.data);

export const getFinancialHealthScore = () =>
    api.get('/analytics/health-score').then(r => r.data);
