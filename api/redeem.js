import axios from 'axios';
import { API_BASE_URL } from './config';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});


export const getAllRedeemables = async () => {
  try {
    const response = await apiClient.get(`redeemable/all`);
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};


export const getAllAvailableRedeemables = async (userId) => {
  try {
    const response = await apiClient.get(`redeemable/available/${userId}`);
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export const redeemItem = async (userId, redeemableId) => {
  try {


    const response = await apiClient.post(`redeemable/redeem/${redeemableId}`, {
      userId, // Send userId in the request body
    });

    return response.data;
  } catch (error) {
    console.error('API call error:', error.response ? error.response.data : error.message);
    throw error;
  }

};

export const getBasket = async (userId) => {
  try {
    const response = await apiClient.get(`redeemable/basket/${userId}`);
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};
