import axios from 'axios';

const api = axios.create({
  // Default '/api' = same origin, which is how the Vercel deployment serves
  // the API. In local dev the .env file points to http://localhost:5000/api.
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rnk_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
