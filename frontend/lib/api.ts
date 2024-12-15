import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // FastAPI backend URL
  withCredentials: true, // Ensures cookies are sent
});

export default api;
