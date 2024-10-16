import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native'; // Import Image for profile pictures
import { acceptJoinRequest, rejectJoinRequest, removeMember } from '../../../api';
import useUserIdStore from '../../../stores/useUserStore';

const ManageTeam = ({ teamData, teamId, members, setMembers, setTeamData }) => {
  const { userId } = useUserIdStore();

  const handleUpdateJoinRequest = async (action, request) => {
    const requestUserId = request.userId;
    const username = request.userId.username;
    console.log('bruh' + requestUserId._id)
    try {
      if (action === 'Accepted') {
        await acceptJoinRequest(teamId, requestUserId._id, userId);
        Alert.alert('Success', 'Join request accepted');


        const newMember = { _id: requestUserId, username };
        setMembers((prevMembers) => [...prevMembers, newMember]);

        const updatedJoinRequests = teamData.joinRequests.filter(req => req._id !== request._id);
        setTeamData({ ...teamData, joinRequests: updatedJoinRequests });

      } else if (action === 'Denied') {
        await rejectJoinRequest(teamId, requestUserId._id, userId);
        Alert.alert('Success', 'Join request denied');


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
      setMembers(members.filter(member => member._id !== memberId));
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


            {request.userId.profilePicture && request.userId.profilePicture !== '' ? (
              <Image
                source={{ uri: request.userId.profilePicture }}
                style={styles.profilePicture}
              />
            ) : (
              <Image
                source={require('../../../assets/default-avatar.png')}
                style={styles.profilePicture}
              />
            )}
            <Text style={styles.requestText}>
              Username: {request.userId.username}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.acceptButton]}
                onPress={() => handleUpdateJoinRequest('Accepted', request)}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.denyButton]}
                onPress={() => handleUpdateJoinRequest('Denied', request)}
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
                source={{ uri: member.profilePicture }}
                style={styles.profilePicture}
              />
            ) : (
              <Image
                source={require('../../../assets/default-avatar.png')}
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
              <Text style={styles.selfLabel}>You</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestText: {
    color: '#B0B0B0',
    flex: 1,
    marginLeft: 10,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    flex: 1,
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
    color: '#1DB954',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ManageTeam;
