import { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import useFetch from '../hooks/useFetch';
import { getLeaderboard } from '../api';
import LeaderboardItem from './components/LeaderboardItem';
import Loader from './components/Loader';
import Error from './components/ErrorMessage';
import EmptyState from './components/EmptyState';

const LeaderboardScreen = () => {
  const { data, loading, error, refetch } = useFetch(getLeaderboard, null, { maxRetries: 3, retryDelay: 2000 });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error message={`Error fetching leaderboard: ${error}`} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.leaderboard || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <LeaderboardItem
            rank={index + 1}
            username={item.username}
            points={item.allTimePoints}
            profilePicture={item.profilePicture}
          />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={<EmptyState message="No leaderboard data available." />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default LeaderboardScreen;
