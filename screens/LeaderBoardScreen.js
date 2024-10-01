
import { View, Text, FlatList, StyleSheet } from 'react-native';
import useFetch from '../api/useFetch';
import { getLeaderboard } from '../api';
import LeaderboardItem from './components/LeaderboardItem';
import Loader from './components/Loader';
import Error from './components/ErrorMessage';
import EmptyState from './components/EmptyState';

const LeaderboardScreen = () => {
  const { data, loading, error } = useFetch(getLeaderboard, null, { maxRetries: 3, retryDelay: 2000 });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error message={error} />;
  }

  const leaderboardData = data?.leaderboard || [];

  return (
    <View style={styles.container}>
      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.rank.toString()}
        renderItem={({ item }) => (
          <LeaderboardItem rank={item.rank} username={item.username} points={item.points} />
        )}
        ListEmptyComponent={<EmptyState message="No leaderboard data available." />} // Use the EmptyState component
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
