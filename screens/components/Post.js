import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import useFetch from '../../hooks/useFetch';
import { getUser } from '../../api';
import { useMemo } from 'react';

const Post = ({ post }) => {
  const fetchUser = useMemo(() => () => getUser(post.userId), [post.userId]);

  const { data, loading, error } = useFetch(fetchUser, null, { maxRetries: 3, retryDelay: 2000 });

  const handleLike = () => {
  };

  const handleOpenComments = () => {
  };

  const userProfilePicture = data?.user?.profilePicture || 'https://via.placeholder.com/150';
  const username = data?.user?.username || 'User123';


  if (loading) {
    return <Text>Loading user...</Text>;
  }

  if (error) {
    return <Text>Error fetching user data: {error.message}</Text>;
  }

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
            <Text style={styles.likes}>{post.likes.length} likes</Text>
          </Pressable>
          <Pressable onPress={handleOpenComments}>
            <Text style={styles.comments}>View comments</Text>
          </Pressable>
        </View>

        <Text style={styles.timestamp}>{new Date(post.createdAt).toLocaleString()}</Text>
      </View>
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
