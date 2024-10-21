import axios from 'axios';
import { API_BASE_URL } from './config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const createPost = async (description, userId, image, challengeId) => {
  const formData = new FormData();
  formData.append('description', description);
  formData.append('userId', userId);
  formData.append('challengeId', challengeId);
  if (image) {
    formData.append('img', {
      uri: image.uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });
  }

  try {
    const response = await apiClient.post('/posts/create-post', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
};


export const likeOrUnlikePost = async (postId, userId) => {
  try {
    const response = await apiClient.put(`/posts/like-post/${postId}`, { userId });
    return response.data;
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
}

export const getUserPosts = async (userId) => {
  try {
    const response = await apiClient.get(`/posts/get-user-posts/${userId}`);
    return response.data; // This will include the message and posts (if any)
  } catch (error) {
    console.error('Error fetching user posts:', error.message);
    return null; // Return null to handle in the component
  }
};


export const getTimeLinePosts = async (userId) => {
  try {
    const response = await apiClient.get(`/posts/get-timeline-posts/${userId}`);
    return response.data; // This will include the message and posts (if any)
  } catch (error) {
    console.error('Error fetching user posts:', error.message);
    return null; // Return null to handle in the component
  }
};

