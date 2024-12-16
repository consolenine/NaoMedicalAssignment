import axios from 'axios';
import { getCookie } from 'typescript-cookie';
import constants from "@/utils/constants";

const apiHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
}

if (typeof document !== 'undefined') {
  const authCookie = getCookie(constants.AUTH_COOKIE);
  if (authCookie && authCookie.length > 0) {
    apiHeaders['Authorization'] = 'Bearer ' + authCookie;
  }
}

const api = axios.create({
  baseURL: constants.BACKEND_URL, // FastAPI backend URL
  withCredentials: true, // Ensures cookies are sent
  headers: apiHeaders
});

export default api;
