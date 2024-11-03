import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getFeed, getSelf } from '../api';
import Loader from './components/Loader';
import Post from './components/Post';
import { SafeAreaView } from 'react-native-safe-area-context';
import useUserIdStore from '../stores/useUserStore';

const HomeScreen = () => {
  const { userId } = useUserIdStore();

  const fetchPosts = async () => {
    const response = await getFeed(userId);
    return response.data;
  };

  // Fetch user posts using React Query
  const { data: posts = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['feed'],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Fetch user data using React Query
  const {
    data: userData,
    refetch: refetchUserData,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: ['fetchUserHomeScreen'],
    queryFn: getSelf,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const reversedData = [...posts].reverse();

  if (isLoading || isUserLoading) {
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
        renderItem={({ item }) => <Post post={item} userData={userData} />}
        refreshing={isFetching}
        onRefresh={() => {
          refetch();       // Refetch posts
          refetchUserData(); // Refetch user data
        }}
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
