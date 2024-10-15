import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native'; // Import Image for profile pictures
import { acceptJoinRequest, rejectJoinRequest, removeMember } from '../../../api';
import useUserIdStore from '../../../stores/useUserStore';

const ManageTeam = ({ teamData, teamId, members, setMembers, setTeamData }) => {
  const { userId } = useUserIdStore();

  const handleUpdateJoinRequest = async (action, request) => {
    const requestUserId = request.userId._id;
    const username = request.userId.username; // Get the actual username from the request

    try {
      if (action === 'Accepted') {
        await acceptJoinRequest(teamId, requestUserId, userId);
        Alert.alert('Success', 'Join request accepted');

        // Update members state to include the new member with their actual username
        const newMember = { _id: requestUserId, username }; // Use the actual username
        setMembers((prevMembers) => [...prevMembers, newMember]);

        // Update teamData to remove the accepted request
        const updatedJoinRequests = teamData.joinRequests.filter(req => req._id !== request._id);
        setTeamData({ ...teamData, joinRequests: updatedJoinRequests });

      } else if (action === 'Denied') {
        await rejectJoinRequest(teamId, requestUserId, userId);
        Alert.alert('Success', 'Join request denied');

        // Update teamData to remove the denied request
        const updatedJoinRequests = teamData.joinRequests.filter(req => req._id !== request._id);
        setTeamData({ ...teamData, joinRequests: updatedJoinRequests });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process request.');
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await removeMember(teamId, memberId, userId);
      Alert.alert('Success', 'Member removed successfully!');
      setMembers(members.filter(member => member._id !== memberId)); // Update local state
    } catch (error) {
      Alert.alert('Error', 'Failed to remove member. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Team</Text>
      {teamData.joinRequests.length > 0 ? (
        teamData.joinRequests.map((request) => (
          <View key={request._id} style={styles.requestContainer}>
            {/* Render profile picture if available */}
            {request.userId.profilePicture ? (
              <Image
                source={{ uri: request.userId.profilePicture }}
                style={styles.profilePicture}
              />
            ) : null}
            <Text style={styles.requestText}>
              Username: {request.userId.username}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.acceptButton]}
                onPress={() => handleUpdateJoinRequest('Accepted', request)} // Pass the entire request object
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.denyButton]}
                onPress={() => handleUpdateJoinRequest('Denied', request)} // Pass the entire request object
              >
                <Text style={styles.buttonText}>Deny</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noRequests}>No join requests.</Text>
      )}
      <Text style={styles.membersHeader}>Members:</Text>
      {members.length > 0 ? (
        members.map((member) => (
          <View key={member._id} style={styles.memberContainer}>
            <Text style={styles.memberText}>Username: {member.username}</Text>
            {member._id !== userId && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveMember(member._id)}
              >
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noMembers}>No members in this team yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#0F1F26',
    flex: 1,
  },
  header: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  requestContainer: {
    padding: 10,
    backgroundColor: '#1C2A33',
    borderRadius: 8,
    marginBottom: 10,
  },
  requestText: {
    color: '#B0B0B0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    elevation: 2,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#1DB954',
  },
  denyButton: {
    backgroundColor: '#FF3D00',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noRequests: {
    color: '#B0B0B0',
  },
  memberContainer: {
    padding: 10,
    backgroundColor: '#1C2A33',
    borderRadius: 8,
    marginBottom: 10,
  },
  membersHeader: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
  },
  memberText: {
    color: '#B0B0B0',
  },
  removeButton: {
    backgroundColor: '#FF3D00',
    paddingVertical: 6, // Smaller padding for consistency
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  noMembers: {
    color: '#B0B0B0',
  },
  profilePicture: {
    width: 40, // Adjust based on your design
    height: 40, // Adjust based on your design
    borderRadius: 20, // To make it a circle
    marginBottom: 5, // Spacing between the image and text
  },
});

export default ManageTeam;
