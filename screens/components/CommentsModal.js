import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { postComment } from '../../api';
import useUserStore from '../../stores/useUserStore';

const CommentsModal = ({ visible, onClose, postId, comments: initialComments }) => {
  const { userId } = useUserStore();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);


  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleCommentSubmit = async () => {
    if (newComment.trim() === '') return;

    const commentToPost = {
      text: newComment,
      userId,
      postId,
    };

    try {
      const response = await postComment(commentToPost);


      const newCommentObject = {
        _id: response._id,
        text: newComment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
        username: 'Anonymous',
      };

      setComments(prevComments => [...prevComments, newCommentObject]);
      setNewComment('');
      setError(null);
    } catch (error) {
      setError('Failed to post comment.');
      console.error('API error:', error);
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.comment}>
      <Text style={styles.username}>{item.username || 'Anonymous'}</Text>
      <Text style={styles.commentText}>{item.text}</Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Comments</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={<Text>No comments yet. Be the first to comment!</Text>}
          />

          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Button title="Submit" onPress={handleCommentSubmit} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '80%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalClose: {
    color: 'blue',
    fontSize: 16,
  },
  comment: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
});

export default CommentsModal;
