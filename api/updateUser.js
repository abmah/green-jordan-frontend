import axios from 'axios';
import { API_BASE_URL } from './config';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const updatePassword = async (oldPassword, newPassword, userId) => {
  try {
    const response = await apiClient.put(`/auth/update-password/${userId}`, { oldPassword, newPassword });
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

export const updateUsername = async (username, userId) => {
  try {
    const response = await apiClient.put(`/users/update-username/${userId}`, { username, userId });
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}