import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, FlatList, Image } from 'react-native';
import { sendJoinRequest } from '../../../api';
import useUserIdStore from '../../../stores/useUserStore';
import Loader from '../Loader';

const Overview = ({ teamData, members }) => {
  const { userId } = useUserIdStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showNoMembersMessage, setShowNoMembersMessage] = useState(false);

  // Check if the user is a member
  const isMember = teamData.members.some(member => member._id === userId);
  const isAdmin = teamData.admin === userId;
  const showJoinButton = !isMember && !isAdmin;

  const handleJoinRequest = async () => {
    try {
      await sendJoinRequest(teamData._id, userId);
      Alert.alert("Success", "Join request sent successfully!");
    } catch (error) {
      console.error("Error sending join request:", error);
      Alert.alert("Error", "Failed to send join request.");
    }
  };

  const renderMemberItem = ({ item }) => {
    return (
      <View style={styles.memberCard}>
        <Image
          source={{
            uri: item.profilePicture || 'https://via.placeholder.com/100',
          }}
          style={styles.profilePicture}
        />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>
            {item.username}
            {/* Check if the current member is the admin */}
            {item._id === teamData.admin && <Text style={styles.adminLabel}> (Admin)</Text>}
            {item._id === userId && <Text style={styles.youLabel}> - You</Text>}
            <Text style={styles.pointsLabel}> - {item.points} pts</Text>
          </Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (members.length === 0) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowNoMembersMessage(true);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
      setShowNoMembersMessage(false);
    }
  }, [members]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team Overview</Text>
      <Text style={styles.details}>Name: {teamData.name}</Text>
      <Text style={styles.details}>Description: {teamData.description}</Text>

      {showJoinButton && (
        <Button title="Send Join Request" onPress={handleJoinRequest} color="#4CAF50" />
      )}

      <Text style={styles.membersTitle}>Team Members</Text>

      {isLoading ? (
        <Loader />
      ) : showNoMembersMessage ? (
        <Text style={styles.emptyMessage}>No team members found.</Text>
      ) : (
        <FlatList
          data={members}
          renderItem={renderMemberItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.membersList}
        />
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
  title: {
    fontSize: 26,
    color: '#F5F5F5',
    fontWeight: '700',
    marginBottom: 16,
  },
  details: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 8,
  },
  membersTitle: {
    fontSize: 22,
    color: '#F5F5F5',
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
  },
  membersList: {
    paddingBottom: 16,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B2B38',
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    borderColor: '#ffffff1a',
    borderWidth: 1,
  },
  profilePicture: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    color: '#F5F5F5',
    fontSize: 18,
    fontWeight: '600',
  },
  adminLabel: {
    color: '#FFD700',
    fontSize: 14,
  },
  pointsLabel: {
    color: '#B0B0B0',
    fontSize: 14,
    marginLeft: 4, // Add a little space between username and points
  },
  youLabel: {
    color: '#1DB954', // Green color for "You"
    fontSize: 14,
    fontWeight: '600',
  },
  emptyMessage: {
    color: '#F5F5F5',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Overview;
