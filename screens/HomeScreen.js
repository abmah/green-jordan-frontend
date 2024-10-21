import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getFeed, getSelf } from '../api'; // Import both feed and self API calls
import Loader from './components/Loader'; // Custom loader component
import Post from './components/Post'; // Component to render each post
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTimeLinePosts } from '../api';
import useUserIdStore from '../stores/useUserStore';




const HomeScreen = () => {

  const { userId } = useUserIdStore();


  const fetchPosts = async () => {
    const response = await getTimeLinePosts(userId);
    return response.data;
  };
  const [userData, setUserData] = useState(null); // State to store user data
  const { data: posts = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['feed'],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    refetchOnWindowFocus: false, // Only refetch when manually triggered
  });

  // Fetch user data in useEffect
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await getSelf();
        setUserData(userResponse); // Store user data
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);




  const reversedData = [...posts].reverse();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <View style={styles.errorStateContainer}>
        <Text style={styles.errorStateText}>
          Error loading posts. Please try again later.
        </Text>
      </View>
    );
  }

  const EmptyStateComponent = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateText}>No posts available.</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        style={{ paddingTop: 10, backgroundColor: '#0F1F26' }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={<EmptyStateComponent />}
        data={reversedData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Post post={item} userData={userData} />} // Pass user data to Post component
        refreshing={isFetching}
        onRefresh={refetch} // Use refetch to reload data
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F1F26',
  },
  errorStateText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Nunito-ExtraBold',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F1F26',
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Nunito-ExtraBold',
  },
});

export default HomeScreen;
