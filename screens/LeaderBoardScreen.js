import { useState } from 'react';
import { View, FlatList, StyleSheet, Platform, Text } from 'react-native';
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
      <View style={styles.leaderboardHeader}>
        <Text style={styles.leaderboardTitle}>Leaderboard</Text>
      </View>
      <FlatList
        style={{ flex: 1, paddingHorizontal: 20 }}
        data={data?.leaderboard || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <LeaderboardItem
            rank={index + 1}
            username={item.username}
            points={item.allTimePoints}
            profilePicture={item.profilePicture || null}
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
    backgroundColor: '#0F1F26',
    paddingTop: Platform.OS === 'android' ? 50 : 0,
  },

  leaderboardHeader: {
    height: 40,
    borderBottomWidth: 1,
    width: '100%',
    borderBottomColor: '#37464f',
    justifyContent: 'center',
    alignItems: 'center',
  },

  leaderboardTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-ExtraBold',
    color: '#fff',
  },
});

export default LeaderboardScreen;
