// HomeScreen.js
import React from 'react';
import { View, FlatList } from 'react-native';
import useFetch from '../hooks/useFetch';
import { getFeed } from '../api/feed';
import Loader from './components/Loader';
import Error from './components/ErrorMessage';
import Post from './components/Post';
import EmptyState from './components/EmptyState';

const HomeScreen = () => {
  const { data, loading, error } = useFetch(getFeed, null, { maxRetries: 3, retryDelay: 2000 });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error message={`Error fetching feed: ${error}`} />;
  }


  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        ListEmptyComponent={<EmptyState message="No posts available." />}
        data={data?.data} // Accessing the posts array from the response
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Post post={item} />}
      />
    </View>
  );
};

export default HomeScreen;
