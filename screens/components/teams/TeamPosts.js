import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { getTeamPosts } from '../../../api';
import Post from '../Post';
import Loader from '../Loader';

const TeamPosts = ({ teamId }) => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    fetchPosts();
  }, [teamId]);

  const fetchPosts = async () => {
    setLoading(true); // Start loading
    try {
      const postResponse = await getTeamPosts(teamId);
      if (postResponse.data) {
        setPosts(postResponse.data.reverse()); // Latest posts first
      }
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {loading ? ( // Render Loader while loading
        <Loader />
      ) : posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={({ item }) => <Post post={item} />}
          keyExtractor={(item) => item._id}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      ) : (
        <Text style={styles.noPosts}>No posts in this team yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1F26',
  },
  noPosts: {
    color: '#B0B0B0',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TeamPosts;
