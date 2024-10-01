import React from 'react';
import { View, Text, Image, StyleSheet, Button, Alert } from 'react-native';
import useUserStore from '../stores/useUserStore';
import useFetch from '../hooks/useFetch';
import { getSelf } from '../api/user';

const ProfileScreen = () => {
  const { clearuserId } = useUserStore();
  const { data, loading, error } = useFetch(getSelf, null, { maxRetries: 3, retryDelay: 2000 });

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error fetching profile: {error.message}</Text>;
  }

  const userData = data.user;

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          await clearuserId();
          Alert.alert("Logged out successfully");
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: userData.coverPicture || 'https://via.placeholder.com/600x200' }}
        style={styles.coverImage}
      />
      <View style={styles.profileInfo}>
        <Image
          source={{ uri: userData.profilePicture || 'https://via.placeholder.com/150' }}
          style={styles.profilePicture}
        />
        <Text style={styles.username}>{userData.username}</Text>
        <Text style={styles.email}>{userData.email}</Text>
        <View style={styles.statsContainer}>
          {renderStats(userData)}
        </View>
        <Button title="Logout" onPress={handleLogout} color="#FF6347" />
      </View>
    </View>
  );
};

const renderStats = ({ followers, followings, points }) => (
  <>
    <Text style={styles.stats}>Followers: {followers.length}</Text>
    <Text style={styles.stats}>Following: {followings.length}</Text>
    <Text style={styles.stats}>Points: {points}</Text>
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: -80,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '80%',
  },
  stats: {
    fontSize: 16,
  },
});

export default ProfileScreen;
