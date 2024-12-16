import { AxiosResponse } from 'axios';
import { setCookie } from "typescript-cookie";
import axios from './api';
import constants from "@/utils/constants";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post('/api/auth/login', { email, password });
    if (response.status == 200 && response.data) {
      setCookie(constants.AUTH_COOKIE, response.data.access_token, {expires: 7})
    }
    return response.data.user;
  } catch (error) {
    console.log("Login failed:", error);
  }
};

export const signUp = async (name: string, email: string, password: string ) => {
  try {
    const response = await axios.post('/api/auth/signup', { name, email, password });
    if (response.status == 200 && response.data) {
      setCookie(constants.AUTH_COOKIE, response.data.access_token, {expires: 7})
    }
    return response.data;
  } catch (error) {
    console.log("Signup failed:", error);
  }
};

export const getUser = async () => {
  try {
    const response = await axios.get('/api/auth/me');
    return response.data;
  } catch (error) {
    console.log("Get user failed:", error);
    setCookie(constants.AUTH_COOKIE, null, {expires: -1})
  }
};
