import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Alert, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getAllTeams, sendJoinRequest, getTeamMembers, acceptJoinRequest, rejectJoinRequest } from '../../api';
import useUserIdStore from '../../stores/useUserStore';

const TeamDetails = () => {
  const { userId } = useUserIdStore();
  const route = useRoute();
  const { isAdmin, teamId } = route.params;
  const [isInTeam, setIsInTeam] = useState(false);
  const [teamData, setTeamData] = useState({
    name: '',
    description: '',
    members: [],
    joinRequests: [],
  });
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await getAllTeams();
        if (response.data) {
          const currentTeam = response.data.find(team => team._id === teamId);
          if (currentTeam) {
            setTeamData(currentTeam);
            const membersResponse = await getTeamMembers(teamId);
            if (membersResponse.data) {
              setMembers(membersResponse.data);
            }
            setIsInTeam(currentTeam.members.includes(userId));
          }
        }
      } catch (error) {
        console.error('Failed to fetch team data', error);
      }
    };

    if (teamId) {
      fetchTeamData();
    }
  }, [teamId, userId]);

  const fetchTeamDataAgain = async () => {
    // Fetch the latest team data after join request or accept/reject actions
    try {
      const response = await getAllTeams();
      if (response.data) {
        const currentTeam = response.data.find(team => team._id === teamId);
        if (currentTeam) {
          setTeamData(currentTeam);
          const membersResponse = await getTeamMembers(teamId);
          if (membersResponse.data) {
            setMembers(membersResponse.data);
          }
          setIsInTeam(currentTeam.members.includes(userId));
        }
      }
    } catch (error) {
      console.error('Failed to fetch updated team data', error);
    }
  };

  const handleJoinRequest = async () => {
    if (isInTeam) {
      Alert.alert('Info', 'You are already in this team.');
      return;
    }

    try {
      await sendJoinRequest(teamId, userId);
      Alert.alert('Success', 'Join request sent successfully!');
      await fetchTeamDataAgain(); // Refresh data after sending join request
    } catch (error) {
      Alert.alert('Error', 'Failed to send join request. Please try again.');
    }
  };

  const handleUpdateJoinRequest = async (action, requestUserId) => {
    const adminId = userId; // Admin ID is the current user's ID

    try {
      if (action === 'Accepted') {
        await acceptJoinRequest(teamId, requestUserId, adminId);
        Alert.alert('Success', 'Join request accepted successfully!');
      } else if (action === 'Denied') {
        await rejectJoinRequest(teamId, requestUserId, adminId);
        Alert.alert('Success', 'Join request rejected successfully!');
      }
      await fetchTeamDataAgain(); // Refresh team data after action
    } catch (error) {
      Alert.alert('Error', `Failed to ${action.toLowerCase()} join request. Please try again.`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{teamData.name}</Text>
      <Text style={styles.description}>{teamData.description}</Text>

      {isInTeam ? (
        <Text style={styles.inTeamText}>You are already in this team.</Text>
      ) : (
        !isAdmin && (
          <Button title="Send Join Request" onPress={handleJoinRequest} color="#1DB954" />
        )
      )}

      <Text style={styles.membersHeader}>Members:</Text>
      {members.length > 0 ? (
        members.map((member, index) => (
          <View key={index} style={styles.memberContainer}>
            <Image
              source={member.profilePicture ? { uri: member.profilePicture } : require('../../assets/default-avatar.png')}
              style={styles.profilePicture}
            />
            <View>
              <Text style={styles.memberText}>Username: {member.username}</Text>
              <Text style={styles.memberText}>Email: {member.email}</Text>
              <Text style={styles.memberText}>Points: {member.points}</Text>
              <Text style={styles.memberText}>Streak: {member.streak}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noMembers}>No members in this team yet.</Text>
      )}

      {isAdmin && (
        <View style={styles.joinRequestsContainer}>
          <Text style={styles.joinRequestsHeader}>Join Requests:</Text>
          {teamData.joinRequests.length > 0 ? (
            teamData.joinRequests.map((request, index) => (
              <View key={index} style={styles.requestContainer}>
                <Text style={styles.request}>
                  User ID: {request.userId} | Request Date: {new Date(request.requestDate).toLocaleString()}
                </Text>
                <View style={styles.buttonContainer}>
                  <Button
                    title="Accept"
                    onPress={() => handleUpdateJoinRequest('Accepted', request.userId)}
                    color="#1DB954"
                  />
                  <Button
                    title="Deny"
                    onPress={() => handleUpdateJoinRequest('Denied', request.userId)}
                    color="#FF3D00"
                  />
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noRequests}>No join requests at this time.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0F1F26',
    paddingTop: 50,
  },
  header: {
    fontSize: 28,
    color: 'white',
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 20,
    textAlign: 'center',
  },
  inTeamText: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 20,
    textAlign: 'center',
  },
  membersHeader: {
    fontSize: 22,
    color: 'white',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1C2A33',
    borderRadius: 8,
    marginBottom: 10,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  memberText: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 3,
  },
  noMembers: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 5,
  },
  joinRequestsContainer: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 8,
    padding: 10,
    paddingBottom: 100,
  },
  joinRequestsHeader: {
    fontSize: 22,
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  requestContainer: {
    padding: 10,
    backgroundColor: '#1C2A33',
    borderRadius: 8,
    marginBottom: 10,
  },
  request: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  noRequests: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 5,
  },
});

export default TeamDetails;
