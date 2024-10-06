import React, { useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import useFetch from '../hooks/useFetch';
import { getFeed } from '../api/feed';
import Loader from './components/Loader';
import Error from './components/ErrorMessage';
import Post from './components/Post';
import EmptyState from './components/EmptyState';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const { data, loading, error, refetch } = useFetch(getFeed, null, { maxRetries: 3, retryDelay: 2000 });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error message={`Error fetching feed: ${error}`} />;
  }

  const reversedData = data?.data ? [...data.data].reverse() : [];

  return (
    <SafeAreaView>
      <FlatList
        style={{ paddingTop: 10, backgroundColor: "#0F1F26" }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={<EmptyState message="No posts available." />}
        data={reversedData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Post post={item} />}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
