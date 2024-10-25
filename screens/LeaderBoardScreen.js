import { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Platform, Text } from "react-native";
import { getLeaderboard } from "../api";
import LeaderboardItem from "./components/LeaderboardItem";
import Loader from "./components/Loader";
import EmptyState from "./components/EmptyState";
import { useTranslation } from "react-i18next"; // Import the useTranslation hook

const LeaderboardScreen = () => {
  const { t } = useTranslation(); // Initialize the translation hook
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
      console.error("Error fetching leaderboard:", err);
      setError(t("leaderboard_screen.error")); // Use translated error message
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

  const topThree = data.slice(0, 3); // Top 3 players for the podium
  const rest = data.slice(3); // Remaining players

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      ) : (
        <>
          <View style={styles.leaderboardHeader}>
            <Text style={styles.leaderboardTitle}>
              {t("leaderboard_screen.title")}
            </Text>
          </View>

          {/* Podium View for top 3 */}
          <View style={styles.podiumContainer}>
            <LeaderboardItem
              rank={2}
              username={topThree[1]?.username}
              points={topThree[1]?.allTimePoints}
              profilePicture={topThree[1]?.profilePicture || null}
            />
            <LeaderboardItem
              rank={1}
              username={topThree[0]?.username}
              points={topThree[0]?.allTimePoints}
              profilePicture={topThree[0]?.profilePicture || null}
            />
            <LeaderboardItem
              rank={3}
              username={topThree[2]?.username}
              points={topThree[2]?.allTimePoints}
              profilePicture={topThree[2]?.profilePicture || null}
            />
          </View>

          {/* FlatList for the rest of the leaderboard */}
          <FlatList
            style={{ flex: 1, paddingHorizontal: 20 }}
            data={rest}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <LeaderboardItem
                rank={index + 4} // Adjust rank for the remaining players
                username={item.username}
                points={item.allTimePoints}
                profilePicture={item.profilePicture || null}
              />
            )}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={
              <EmptyState message={t("leaderboard_screen.empty_state")} />
            }
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1F26",
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F1F26",
  },
  errorMessage: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  leaderboardHeader: {
    height: 40,
    borderBottomWidth: 1,
    width: "100%",
    borderBottomColor: "#37464f",
    justifyContent: "center",
    alignItems: "center",
  },
  leaderboardTitle: {
    fontSize: 24,
    fontFamily: "Nunito-ExtraBold",
    color: "#fff",
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Spaces evenly between 2nd, 1st, and 3rd
    paddingBottom: 20,
    borderBottomColor: "#37464f",
    borderBottomWidth: 1,
  },
});

export default LeaderboardScreen;
