import axios from 'axios';
import { API_BASE_URL } from './config';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const createPost = async ({ description, image, userId }) => {

  try {
    const response = await apiClient.post('posts', { description, image, userId });
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }

}


export const likeOrUnlikePost = async ({ postId, userId }) => {
  try {
    const response = await apiClient.get('posts/like-post');
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};
