import axios from './api';

export const login = async (username: string, password: string) => {
  const response = await axios.post('/api/auth/login', { username, password });
  return response.data; // Backend should return the token
};

export const logout = async () => {
  await axios.post('/api/auth/logout');
};

export const getUser = async () => {
  const response = await axios.get('/api/auth/me');
  return response.data; // Backend should return user info
};
