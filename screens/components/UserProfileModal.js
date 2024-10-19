import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { getFullUser } from "../../api"; // Import only the fetch user API function
import Icon from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

const UserProfileView = ({ userId, visible, onClose }) => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false); // Track follow status

  useEffect(() => {
    if (userId && visible) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const response = await getFullUser(userId);
          setUserData(response.data);
          setFollowing(response.data.isFollowing); // Assume API returns if the user is being followed
        } catch (error) {
          console.error("Failed to fetch user data", error);
          Alert.alert("Error", t("userProfile.error_fetch"));
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [userId, visible]);

  const handleFollow = () => {
    // Toggle the following state without making an API request
    setFollowing((prevFollowing) => !prevFollowing);
  };

  const renderPost = ({ item }) => <View></View>;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#8AC149"
            style={{ padding: 20 }}
          />
        ) : (
          <>
            <View style={styles.profileContainer}>
              <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.backButton}>
                  <Icon name="arrow-back" size={30} color="#fff" />
                </TouchableOpacity>

                <Pressable>
                  <Text style={styles.profileReport}>{t("post.report")}</Text>
                </Pressable>
              </View>

              <View style={styles.profileHeader}>
                <Image
                  source={{
                    uri:
                      userData?.profilePicture ||
                      "https://via.placeholder.com/150",
                  }}
                  style={styles.profileImage}
                />
                <Text style={styles.username}>{userData?.username}</Text>

                {/* Follow Button */}
                <TouchableOpacity
                  onPress={handleFollow}
                  style={[
                    styles.followButton,
                    { backgroundColor: following ? "#21603F" : "#8AC149" },
                  ]}
                >
                  <Text style={styles.followButtonText}>
                    {following
                      ? t("userProfile.unfollow")
                      : t("userProfile.follow")}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.statsContainer}>
                <Text style={styles.stats}>
                  {t("userProfile.points")}: {userData?.points || 0}
                </Text>
                <Text style={styles.stats}>
                  {t("userProfile.followers")}:{" "}
                  {userData?.followers.length || 0}
                </Text>
                <Text style={styles.stats}>
                  {t("userProfile.following")}:{" "}
                  {userData?.followings.length || 0}
                </Text>
              </View>
            </View>

            <FlatList
              data={userData?.posts}
              renderItem={renderPost}
              keyExtractor={(post) => post._id}
              style={styles.postsList}
            />
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1F26",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between", // Align back and report buttons to the ends
    padding: 10,
  },
  backButton: {
    padding: 10,
  },
  profileReport: {
    color: "#fff",
    fontFamily: "Nunito-Bold",
    fontSize: 16,
  },
  profileHeader: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1C4B5640",
    paddingBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#00A9C5",
  },
  username: {
    fontSize: 24,
    fontFamily: "Nunito-ExtraBold",
    color: "#ffffff",
    marginBottom: 5,
    marginTop: 10,
  },
  followButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    width: "100%",
    maxWidth: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  followButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Nunito-ExtraBold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    paddingBottom: 10,
  },
  stats: {
    fontSize: 18,
    color: "#ffffff",
    fontFamily: "Nunito-ExtraBold",
  },
  postsList: {
    marginTop: 10,
  },
});

export default UserProfileView;
