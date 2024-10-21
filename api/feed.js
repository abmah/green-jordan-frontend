import axios from 'axios';
import { API_BASE_URL } from './config';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});


export const getFeed = async () => {
  try {
    const response = await apiClient.get('posts/get-all-posts');
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};
