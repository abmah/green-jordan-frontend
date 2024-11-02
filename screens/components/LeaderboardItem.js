import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import UserImage from '../../assets/user.png';
import UserProfileView from "./UserProfileModal";
import useUserIdStore from "../../stores/useUserStore";

const LeaderboardItem = ({ rank, username, points, profilePicture, userId }) => {
  const { userId: loggedUserId } = useUserIdStore();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    if (userId !== loggedUserId) {
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

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
          <Text style={[styles.rankText, styles.podiumRankText]}>{rank}</Text>
          <TouchableOpacity onPress={handlePress} style={styles.imageNameContainer}>
            <Image
              source={
                profilePicture
                  ? { uri: profilePicture }
                  : { uri: Image.resolveAssetSource(UserImage) }
              }
              style={styles.podiumImage}
            />
            <Text style={styles.username}>{username}</Text>
          </TouchableOpacity>
          <Text style={[styles.points, styles.podiumPoints]}>
            {points}
          </Text>
        </View>
        <UserProfileView selectedUserId={userId} visible={modalVisible} onClose={closeModal} />
      </View>
    );
  }

  // Regular item for ranks beyond 3
  return (
    <View style={styles.item}>
      <View style={styles.userInfo}>
        <Text style={styles.rankText}>{rank}</Text>
        <TouchableOpacity onPress={handlePress}>
          <Image
            source={
              profilePicture
                ? { uri: profilePicture }
                : { uri: Image.resolveAssetSource(UserImage).uri }
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.username}>{username}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.points}>
        {points} {t("leaderboard.points")}
      </Text>
      <UserProfileView selectedUserId={userId} visible={modalVisible} onClose={closeModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
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
  podiumRankText: {
    textAlign: "center",
    fontSize: 30,
  },
  profileImage: {
    minWidth: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 20,
  },
  podiumImage: {
    minWidth: 65,
    height: 65,
    borderRadius: 65,
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
  podiumPoints: {
    fontSize: 24,
    fontFamily: "Nunito-Black",
  },
  podiumItem: {
    marginVertical: 20,
    width: 120,
    height: 250,
    elevation: 4,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
  },
  imageNameContainer: {
    alignItems: "center",
  },
  podiumContent: {
    height: "100%",
    alignContent: "center",
    justifyContent: "space-around",
    alignItems: "center",
  },
  podiumFirst: {
    backgroundColor: "#FF9804",
    shadowColor: '#FF9804',
  },
  podiumSecond: {
    backgroundColor: "#0F9AFE",
    shadowColor: '#0F9AFE',
    top: 30,
  },
  podiumThird: {
    backgroundColor: "#EE5555",
    shadowColor: '#EE5555',
    top: 30,
  },
});

export default LeaderboardItem;
