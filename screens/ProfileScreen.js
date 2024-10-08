import { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, FlatList, RefreshControl } from 'react-native';
import useUserStore from '../stores/useUserStore';
import * as SecureStore from 'expo-secure-store';
import { getSelf } from '../api/user';
import { getUserPosts } from '../api/post';
import Post from './components/Post';

const ProfileScreen = () => {
  const { clearuserId, userId } = useUserStore();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getSelf();
        setUserData(data.user);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch user posts
  const fetchUserPosts = useCallback(async () => {
    if (!userId) return;

    setRefreshing(true);
    try {
      const response = await getUserPosts(userId);
      if (response) {
        if (response.data.length === 0) {
          // Instead of setting a message, you can handle it directly in the return statement
          setUserPosts([]);
        } else {
          setUserPosts(response.data);
        }
      }
    } catch (postError) {
      console.error("Error fetching user posts:", postError);
      setError(postError);
    } finally {
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  // Handle loading state
  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  // Handle error state
  if (error) {
    return <Text style={styles.errorText}>Error fetching profile: {error.message}</Text>;
  }

  // Handle user logout
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          await clearuserId();
          Alert.alert("Logged out successfully");
          await SecureStore.deleteItemAsync('userId');
        }
      }
    ]);
  };

  // Render No Posts Message
  const renderNoPostsMessage = () => (
    <Text style={styles.noPostsMessage}>There are no posts yet.</Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Image
          source={{ uri: userData?.profilePicture || 'https://via.placeholder.com/150' }}
          style={styles.profilePicture}
        />
        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.username}>{userData?.username}</Text>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsContainer}>
            {userData && renderStats(userData)}
          </View>
        </View>
      </View>

      {/* Render User Posts */}
      {userPosts.length === 0 ? (
        renderNoPostsMessage()
      ) : (
        <FlatList
          data={userPosts}
          renderItem={({ item }) => <Post post={item} />}
          keyExtractor={(item) => item._id}
          style={styles.postsContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchUserPosts} />
          }
        />
      )}
    </View>
  );
};

// Safely render user stats
const renderStats = ({ followers, followings, points }) => (
  <>
    <Text style={styles.stats}>Followers: {followers?.length || 0}</Text>
    <Text style={styles.stats}>Following: {followings?.length || 0}</Text>
    <Text style={styles.stats}>Points: {points || 0}</Text>
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1F26',

  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    padding: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginVertical: 5,
  },
  email: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  statsContainer: {
    justifyContent: 'space-between',
    marginTop: 10,
  },
  stats: {
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
  },
  postsContainer: {
    marginTop: 20,
  },
  noPostsMessage: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#FF6347',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ProfileScreen;
