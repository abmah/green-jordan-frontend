import axios from 'axios';
import { API_BASE_URL } from './config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const createPost = async (description, userId, image) => {
  const formData = new FormData();
  formData.append('description', description);
  formData.append('userId', userId);
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
