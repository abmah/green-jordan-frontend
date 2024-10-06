import { ActivityIndicator, StyleSheet, View } from "react-native";

const Loader = () => {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#8AC149" />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F1F26",
  },
});

export default Loader;
