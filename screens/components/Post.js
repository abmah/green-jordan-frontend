import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert } from 'react-native';
import { likeOrUnlikePost } from '../../api';
import useUserStore from '../../stores/useUserStore';
import CommentsModal from './CommentsModal';

const Post = ({ post }) => {
  const { userId } = useUserStore();
  const [isLiked, setIsLiked] = useState(post.likes.includes(userId));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setIsLiked(post.likes.includes(userId));
  }, [userId, post.likes]);

  const handleLike = async () => {
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
          <Image source={{ uri: userProfilePicture }} style={styles.profileImage} />
          <Text style={styles.username}>{username}</Text>
        </View>
        <Pressable>
          <Text style={styles.reportText}>Report</Text>
        </Pressable>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: post.image }} style={styles.image} />
        <Text style={styles.description}>{post.description}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.likesComments}>
          <Pressable onPress={handleLike}>
            <Text style={styles.likes}>{likesCount} likes</Text>
          </Pressable>
          <Pressable onPress={() => setIsModalVisible(true)}>
            <Text style={styles.comments}>View comments</Text>
          </Pressable>
        </View>
        <Text style={styles.timestamp}>{new Date(post.createdAt).toLocaleString()}</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  reportText: {
    color: 'red',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 500,
    marginBottom: 10,
  },
  description: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    color: '#fff',
    fontSize: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  likesComments: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likes: {
    fontSize: 14,
    color: 'gray',
    marginRight: 10,
  },
  comments: {
    fontSize: 14,
    color: 'gray',
  },
  timestamp: {
    fontSize: 12,
    color: 'lightgray',
  },
});

export default Post;
