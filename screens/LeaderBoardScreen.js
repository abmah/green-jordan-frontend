import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Platform, Text } from 'react-native';
import { getLeaderboard } from '../api';
import LeaderboardItem from './components/LeaderboardItem';
import Loader from './components/Loader';
import EmptyState from './components/EmptyState';

const LeaderboardScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      const result = await getLeaderboard();
      setData(result.leaderboard || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Unable to load leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboard();
    setRefreshing(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      ) : (
        <>
          <View style={styles.leaderboardHeader}>
            <Text style={styles.leaderboardTitle}>Leaderboard</Text>
          </View>
          <FlatList
            style={{ flex: 1, paddingHorizontal: 20 }}
            data={data}
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
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1F26',
    paddingTop: Platform.OS === 'android' ? 50 : 0,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F1F26',
  },
  errorMessage: {
    color: '#fff', // White text
    fontSize: 18,
    textAlign: 'center',
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
