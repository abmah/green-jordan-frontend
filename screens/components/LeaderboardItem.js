import { View, Text, StyleSheet, Image } from "react-native";
import { useTranslation } from "react-i18next"; // Import useTranslation

const LeaderboardItem = ({ rank, username, points, profilePicture }) => {
  const { t } = useTranslation(); // Use the translation function

  // Style the top 3 ranks differently
  let backgroundColor, podiumStyle;
  if (rank === 1) {
    backgroundColor = "#FF9804";
    podiumStyle = styles.podiumFirst;
  } else if (rank === 2) {
    backgroundColor = "#0F9AFE";
    podiumStyle = styles.podiumSecond;
  } else if (rank === 3) {
    backgroundColor = "#EE5555";
    podiumStyle = styles.podiumThird;
  }

  if (rank <= 3) {
    return (
      <View style={[styles.podiumItem, podiumStyle]}>
        <View style={styles.podiumContent}>
          <Text style={styles.rankText}>{rank}</Text>
          <Image
            source={
              profilePicture
                ? { uri: profilePicture }
                : { uri: "https://via.placeholder.com/150" }
            }
            style={styles.profileImage}
          />
          <Text style={styles.username}>{username}</Text>
        </View>
        <Text style={styles.points}>
          {points} {t("leaderboard.points")}
        </Text>
      </View>
    );
  }

  // Regular item for ranks beyond 3
  return (
    <View style={[styles.item, { backgroundColor }]}>
      <View style={styles.userInfo}>
        <Text style={styles.rankText}>{rank}</Text>
        <Image
          source={
            profilePicture
              ? { uri: profilePicture }
              : { uri: "https://via.placeholder.com/150" }
          }
          style={styles.profileImage}
        />
        <Text style={styles.username}>{username}</Text>
      </View>
      <Text style={styles.points}>
        {points} {t("leaderboard.points")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // Regular leaderboard items
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginVertical: 6,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankText: {
    fontSize: 18,
    fontFamily: "Nunito-ExtraBold",
    width: 45,
    color: "#fff",
  },
  profileImage: {
    minWidth: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 20,
  },
  username: {
    fontSize: 16,
    fontFamily: "Nunito-ExtraBold",
    color: "#fff",
  },
  points: {
    fontSize: 16,
    fontFamily: "Nunito-Bold",
    color: "#fff",
  },

  // Podium styling for the top 3
  podiumItem: {
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    marginHorizontal: 10,
    width: "40%",
    maxWidth: 120,
    height: 250,
  },
  podiumContent: {},
  podiumFirst: {
    backgroundColor: "#FF9804",
  },
  podiumSecond: {
    backgroundColor: "#0F9AFE",
  },
  podiumThird: {
    backgroundColor: "#EE5555",
  },
});

export default LeaderboardItem;
