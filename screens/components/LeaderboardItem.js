import { View, Text, StyleSheet } from 'react-native';

const LeaderboardItem = ({ rank, username, points }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.itemText}>
        Rank {rank}: {username} - {points} points
      </Text>
    </View>
  );
};

// Styles for LeaderboardItem
const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
});

export default LeaderboardItem;
