import axios from 'axios';
import { API_BASE_URL } from './config';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});


export const getComments = async (postId) => {
  try {
    const response = await apiClient.get(`posts/comments/${postId}`);
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};


export const postComment = async ({ text, userId, postId }) => {
  try {
    const response = await apiClient.post(`posts/comments/${postId}`, { text, userId });
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}
