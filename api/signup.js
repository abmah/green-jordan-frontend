import axios from 'axios';
import { API_BASE_URL } from './config';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const Signup = async (username, email, password) => {
  try {
    const response = await apiClient.post('/auth/register', { username, email, password });
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}