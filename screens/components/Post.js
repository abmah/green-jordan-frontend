import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert } from 'react-native';
import { likeOrUnlikePost } from '../../api';
import useUserStore from '../../stores/useUserStore';
import CommentsModal from './CommentsModal';
import formatDate from '../../utils/formatDate';
import { LinearGradient } from "expo-linear-gradient";
const Post = ({ post }) => {
  const { userId } = useUserStore();
  const [isLiked, setIsLiked] = useState(post.likes.includes(userId));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setIsLiked(post.likes.includes(userId));
  }, [userId, post.likes]);

  const handleLike = async () => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to like a post.');
      return;
    }

    const wasLiked = isLiked;
    const updatedLikesCount = wasLiked ? likesCount - 1 : likesCount + 1;

    setIsLiked(!wasLiked);
    setLikesCount(updatedLikesCount);

    try {
      await likeOrUnlikePost(post._id, userId);
    } catch (error) {
      Alert.alert('Error', 'Unable to like or unlike the post. Please try again.');
      setIsLiked(wasLiked);
      setLikesCount(wasLiked ? updatedLikesCount + 1 : updatedLikesCount - 1);
    }
  };

  const userProfilePicture = post.userId.profilePicture || 'https://via.placeholder.com/150';
  const username = post.userId.username || 'User';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: userProfilePicture }}
            style={styles.profileImage}
          />
          <Text style={styles.username}>{username}</Text>
        </View>
        <Pressable>
          <Text style={styles.reportText}>report</Text>
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
              Like <Text style={styles.likesCount}>{likesCount}</Text>
            </Text>
          </Pressable>
          <Pressable onPress={() => setIsModalVisible(true)}>
            <Text style={styles.comments}>
              Comments{" "}
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
    fontWeight: "900",
  },
  reportText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "900",
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
    left: 16,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
    marginRight: 10,
    fontWeight: "bold",
  },

  liked: { color: "#0F9AFE" },
  likesCount: { color: "#0F9AFE" },
  comments: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  commentsCount: {
    color: "#8AC149",
  },
  timestamp: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  disabledText: {
    color: "lightgray",
  },
});

export default Post;
