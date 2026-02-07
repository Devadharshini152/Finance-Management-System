
import api from './api';

export const parseTransaction = (text) => api.post('/nlp/parse', { text }).then(r => r.data.data);
export const classifyDescription = (desc) => api.post('/classify', { description: desc }).then(r => r.data);
