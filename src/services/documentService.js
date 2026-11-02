import api from '../api/axios';
import { documentsApi } from '../api/endpoints';

export const getStats = () => api.get('/documents/stats');

export const verifyDocument = (code) => documentsApi.verify(code);
