import axios from 'axios';
import { API_BASE_URL } from './config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Create a new team (only accessible by users not in a team)
export const createTeam = async (userId, teamData) => {
  try {
    const response = await apiClient.post('/teams', { userId, ...teamData });
    return response.data;
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
};

// Update team details (name, description) by the team admin
export const updateTeam = async (teamId, teamData) => {
  try {
    const response = await apiClient.put(`/teams/${teamId}`, teamData);
    return response.data;
  } catch (error) {
    console.error('Error updating team:', error);
    throw error;
  }
};

// Delete a team (only accessible by the team admin)
export const deleteTeam = async (teamId) => {
  try {
    const response = await apiClient.delete(`/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting team:', error);
    throw error;
  }
};

// Get details of a specific team
export const getTeam = async (teamId) => {
  try {
    const response = await apiClient.get(`/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching team details:', error);
    throw error;
  }
};

// get user team
export const getUserTeam = async (userId) => {
  try {
    const response = await apiClient.get(`/teams/get-user-team/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user team:', error);
    throw error;
  }
};

// Send a join request to a team
export const sendJoinRequest = async (teamId, userId) => {
  try {
    const response = await apiClient.post(`/teams/request-join/${teamId}`, { userId });
    return response.data;
  } catch (error) {
    console.error('Error sending join request:', error);
    throw error;
  }
};

// Accept a user's join request (team admin only)
export const acceptJoinRequest = async (teamId, userId, adminId) => {
  try {
    const response = await apiClient.put(`/teams/accept-request/${teamId}/${userId}`, { userId: adminId })
    return response.data;
  } catch (error) {
    console.error('Error accepting join request:', error);
    throw error;
  }
};

// Reject a user's join request (team admin only)
export const rejectJoinRequest = async (teamId, userId, adminId) => {
  try {
    const response = await apiClient.put(`/teams/reject-request/${teamId}/${userId}`, { userId: adminId });
    return response.data;
  } catch (error) {
    console.error('Error rejecting join request:', error);
    throw error;
  }
};


// Remove a member from the team (team admin only)
export const removeMember = async (teamId, userId, adminId) => {
  try {
    const response = await apiClient.put(`/teams/remove-member/${teamId}/${userId}`, { userId: adminId });
    return response.data;
  } catch (error) {
    console.error('Error removing member:', error);
    throw error;
  }
};

// A user leaves the team they are in
export const leaveTeam = async (teamId, userId) => {
  try {
    const response = await apiClient.put(`/teams/leave-team/${teamId}`, { userId });
    return response.data;
  } catch (error) {
    console.error('Error leaving team:', error);
    throw error;
  }
};

// Get the list of members in a team
export const getTeamMembers = async (teamId) => {
  try {
    const response = await apiClient.get(`/teams/members/${teamId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};

// Get all teams
export const getAllTeams = async () => {
  try {
    const response = await apiClient.get('/teams');
    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};


export const getTeamPosts = async (teamId) => {
  try {
    const response = await apiClient.get(`/teams/posts/${teamId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching team posts:', error);
    throw error;
  }
};