import axios from 'axios';
import { API_BASE_URL } from './config';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});


export const getLeaderboard = async () => {
  try {
    const response = await apiClient.get('/challenge/leaderboard');
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};


export const getDailyChallenges = async (userId, challengeId) => {
  try {
    const response = await apiClient.post('/challenge/daily', { userId, challengeId });
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

