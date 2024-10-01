import axios from 'axios';
import { API_BASE_URL } from './config';
import useUserStore from '../stores/useUserStore'; // Import the Zustand store

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getSelf = async () => {
  const { userId } = useUserStore.getState();
  if (!userId) {
    throw new Error('User ID is not available');
  }

  console.log('User ID:', userId);

  try {
    const response = await apiClient.get(`users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export const getUser = async ({ userId }) => {
  try {
    const response = await apiClient.get(`users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};
