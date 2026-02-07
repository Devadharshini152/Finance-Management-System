import api from './api';

export const getPredictions = (params) => api.get('/predictions', { params }).then((r) => r.data);

export const getLatestPredictions = () => api.get('/predictions/latest').then((r) => r.data);
