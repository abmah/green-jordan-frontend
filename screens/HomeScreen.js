import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { getFeed } from "../api/feed";
import Loader from "./components/Loader";
import Post from "./components/Post";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await getFeed();
      setData(response.data || []);
      setError(false);
    } catch (err) {
      console.error("Error fetching feed:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, []);

  if (loading) {
    return <Loader />;
  }

  const ErrorStateComponent = () => (
    <View style={styles.errorStateContainer}>
      <Text style={styles.errorStateText}>
        Error loading posts. Please try again later.
      </Text>
    </View>
  );

  if (error) {
    return <ErrorStateComponent />;
  }

  const reversedData = [...data].reverse();

  const EmptyStateComponent = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateText}>No posts available.</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        style={{ paddingTop: 10, backgroundColor: "#0F1F26" }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={<EmptyStateComponent />}
        data={reversedData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Post post={item} />}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F1F26",
  },
  errorStateText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Nunito-ExtraBold",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F1F26",
  },
  emptyStateText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Nunito-ExtraBold",
  },
});

export default HomeScreen;
