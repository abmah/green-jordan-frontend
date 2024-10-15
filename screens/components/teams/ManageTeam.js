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
            {request.userId.profilePicture && request.userId.profilePicture !== '' ? (
              <Image
                source={{ uri: request.userId.profilePicture }}
                style={styles.profilePicture}
              />
            ) : (
              <Image
                source={require('../../../assets/default-avatar.png')} // Path to default profile picture
                style={styles.profilePicture}
              />
            )}
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
            {member.profilePicture && member.profilePicture !== '' ? (
              <Image
                source={{ uri: member.profilePicture }} // Render member's profile picture
                style={styles.profilePicture}
              />
            ) : (
              <Image
                source={require('../../../assets/default-avatar.png')} // Path to default profile picture
                style={styles.profilePicture}
              />
            )}
            <Text style={styles.memberText}>Username: {member.username}</Text>
            {member._id !== userId ? (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveMember(member._id)}
              >
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.selfLabel}>You</Text> // Display "You" next to your own card
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
    padding: 20,
    backgroundColor: '#0F1F26',
    flex: 1,
  },
  header: {
    fontSize: 26,
    color: '#F5F5F5',
    fontWeight: '700',
    marginBottom: 16,
  },
  requestContainer: {
    padding: 12,
    backgroundColor: '#1C2A33',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center',
  },
  requestText: {
    color: '#B0B0B0',
    flex: 1, // Allows text to grow and take available space
    marginLeft: 10, // Spacing between the image and text
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
    elevation: 2,
    alignItems: 'center',
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
    textAlign: 'center',
    marginTop: 10,
  },
  memberContainer: {
    padding: 12,
    backgroundColor: '#1C2A33',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row', // Align items horizontally
    justifyContent: 'space-between', // Space between member name and remove button
    alignItems: 'center',
  },
  membersHeader: {
    fontSize: 22,
    color: '#F5F5F5',
    marginBottom: 10,
    marginTop: 20,
  },
  memberText: {
    color: '#B0B0B0',
    flex: 1, // Allows text to grow and take available space
  },
  removeButton: {
    backgroundColor: '#FF3D00',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  noMembers: {
    color: '#B0B0B0',
    textAlign: 'center',
    marginTop: 10,
  },
  profilePicture: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  selfLabel: {
    color: '#1DB954', // Change this color to differentiate "You"
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ManageTeam;
