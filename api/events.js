import axios from 'axios';
import { API_BASE_URL } from './config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Function to get all events
export const getAllEvents = async () => {
  try {
    const response = await apiClient.get('event/');
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Function to join an event
export const joinEvent = async (eventId, userId) => {
  try {
    const response = await apiClient.put(`event/join/${eventId}`, { userId });
    return response.data; // Returns the response data from the server
  } catch (error) {
    console.error('Error joining event:', error.response?.data || error.message);
    throw error;
  }
};

// Function to leave an event
export const leaveEvent = async (eventId, userId) => {
  try {
    const response = await apiClient.put(`event/leave/${eventId}`, { userId });
    return response.data; // Returns the response data from the server
  } catch (error) {
    console.error('Error leaving event:', error.response?.data || error.message);
    throw error;
  }
};
