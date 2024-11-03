import axios from 'axios';
import { API_BASE_URL } from './config';
// import useUserStore from '../stores/useUserStore';
import * as SecureStore from 'expo-secure-store';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getSelf = async () => {
  const userId = await SecureStore.getItemAsync('userId');
  if (!userId) {
    throw new Error('User ID is not available');
  }


  try {
    const response = await apiClient.get(`users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

