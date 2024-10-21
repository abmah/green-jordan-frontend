import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable, Alert } from "react-native";
import { likeOrUnlikePost } from "../../api";
import useUserStore from "../../stores/useUserStore";
import CommentsModal from "./CommentsModal";
import UserProfileModal from "./UserProfileModal";
import ReportModal from "./ReportModal"; // Import ReportModal
import formatDate from "../../utils/formatDate";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next"; // Import useTranslation

const Post = ({ post }) => {
  const { t } = useTranslation(); // Use the translation function
  const { userId } = useUserStore();
  const [isLiked, setIsLiked] = useState(post.likes.includes(userId));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false); // State for report modal
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    setIsLiked(post.likes.includes(userId));
  }, [userId, post.likes]);

  const handleLike = async () => {
    if (!userId) {
      Alert.alert(t("post.error_title"), t("post.login_required")); // Localized alert messages
      return;
    }

    const wasLiked = isLiked;
    const updatedLikesCount = wasLiked ? likesCount - 1 : likesCount + 1;

    setIsLiked(!wasLiked);
    setLikesCount(updatedLikesCount);

    try {
      await likeOrUnlikePost(post._id, userId);
    } catch (error) {
      Alert.alert(t("post.error_title"), t("post.like_error")); // Localized error message
      setIsLiked(wasLiked);
      setLikesCount(wasLiked ? updatedLikesCount + 1 : updatedLikesCount - 1);
    }
  };

  const userProfilePicture =
    post.userId.profilePicture || "https://via.placeholder.com/150";
  const username = post.userId.username || "User";

  const openUserProfile = () => {
    if (post.userId._id !== userId) {
      setSelectedUserId(post.userId._id);
      setIsProfileModalVisible(true);
    }
  };

  const handleReport = (reason) => {
    Alert.alert("Report Submitted", `You reported for: ${reason}`);
    // Here you would typically handle the report logic (e.g., send it to the backend)
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Pressable style={styles.profileInfo} onPress={openUserProfile}>
            <Image
              source={{ uri: userProfilePicture }}
              style={styles.profileImage}
            />
            <Text style={styles.username}>{username}</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => setIsReportModalVisible(true)}>
          <Text style={styles.reportText}>{t("post.report")}</Text>
        </Pressable>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: post.image }} style={styles.image} />
        <LinearGradient
          colors={["rgba(0, 0, 0, 0)", "rgba(200,200,200, 0.5)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        />
        <Text style={styles.description}>{post.description}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.likesComments}>
          <Pressable onPress={handleLike} disabled={!userId}>
            <Text
              style={[
                styles.likes,
                !userId && styles.disabledText,
                isLiked && styles.liked,
              ]}
            >
              {t("post.like")}{" "}
              <Text style={styles.likesCount}>{likesCount}</Text>
            </Text>
          </Pressable>
          <Pressable onPress={() => setIsModalVisible(true)}>
            <Text style={styles.comments}>
              {t("post.comments")}{" "}
              <Text style={styles.commentsCount}>{post.comments.length}</Text>
            </Text>
          </Pressable>
        </View>
        <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
      </View>

      <CommentsModal
        comments={post.comments}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        postId={post._id}
      />

      <UserProfileModal
        selectedUserId={selectedUserId}
        visible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
      />

      <ReportModal
        visible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
        onReport={handleReport} // Pass the report handler
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Nunito-ExtraBold",
  },
  reportText: {
    color: "#fff",
    fontFamily: "Nunito-Bold",
    fontSize: 16,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 500,
    marginBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  gradient: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    height: 150,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  description: {
    position: "absolute",
    bottom: 30,
    paddingHorizontal: 16,
    color: "#fff",
    fontSize: 16,
    fontFamily: "Nunito-Bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  likesComments: {
    flexDirection: "row",
    alignItems: "center",
  },
  likes: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Nunito-Bold",
    marginRight: 10,
  },
  liked: { color: "#0F9AFE" },
  likesCount: { color: "#0F9AFE", fontFamily: "Nunito-Bold" },
  comments: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Nunito-Bold",
  },
  commentsCount: {
    color: "#8AC149",
    fontFamily: "Nunito-Bold",
  },
  timestamp: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Nunito-Bold",
  },
  disabledText: {
    color: "lightgray",
    fontFamily: "Nunito-Bold",
  },
});

export default Post;
