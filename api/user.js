import axios from 'axios';
import { API_BASE_URL } from './config';
import useUserStore from '../stores/useUserStore';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});


export const getUser = async (userId) => {
  try {
    const response = await apiClient.get(`users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};


export const updateProfilePicture = async (image, userId) => {
  const formData = new FormData();

  formData.append('img', {
    uri: image.uri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  });

  try {
    const response = await apiClient.put(`/users/update-profile-picture/${userId}`, formData, {
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



export const getFullUser = async (userId) => {
  try {
    const response = await apiClient.get(`users/get-full-user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};
