import { View, Text, Image, StyleSheet } from 'react-native';

const Post = ({ post }) => {
  return (
    <View style={styles.container}>
      {post.image ? (
        <Image source={{ uri: post.image }} style={styles.image} />
      ) : null}
      <Text style={styles.description}>{post.description}</Text>
      <Text style={styles.likes}>{post.likes.length} likes</Text>
      <Text style={styles.timestamp}>{new Date(post.createdAt).toLocaleString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 5,
  },
  likes: {
    fontSize: 14,
    color: 'gray',
  },
  timestamp: {
    fontSize: 12,
    color: 'lightgray',
  },
});

export default Post;
