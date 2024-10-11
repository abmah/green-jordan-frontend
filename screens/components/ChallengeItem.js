// ChallengeItem.js
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { createPost } from '../../api/post';
import { requestCameraPermissions, pickImage } from './ImagePickerHandler';
import Foundation from '@expo/vector-icons/Foundation';
import Ionicons from '@expo/vector-icons/Ionicons';
import ImagePickerModal from './ImagePickerModal';

const ChallengeItem = ({ challenge, userId, fetchChallenges }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCameraPress = async () => {
    if (await requestCameraPermissions()) {
      await pickImage('camera', setImage);
    }
  };

  const handleLibraryPress = async () => {
    await pickImage('library', setImage);
  };

  const handleSubmit = async () => {
    if (!description.trim() || !image) {
      Alert.alert('Validation Error', 'Please provide a description and select an image.');
      return;
    }

    setIsUploading(true);
    try {
      await createPost(description, userId, image, challenge._id);
      setDescription('');
      setImage(null);
      setModalVisible(false);
      fetchChallenges();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={[styles.challengeContainer, challenge.completed && styles.completedContainer]}>
      <View style={styles.cardContent}>
        <View style={styles.challengeImage}>
          <Foundation name="trees" size={100} color="#28A745" />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <Text style={styles.challengePoints}>Points: {challenge.points}</Text>
          <Text style={styles.challengeDescription}>{challenge.description}</Text>

          <View style={styles.attemptButtonContainer}>
            <Pressable
              disabled={challenge.completed}
              style={({ pressed }) => [
                styles.attemptButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={[styles.attemptButtonText, challenge.completed && styles.completedText]}>
                {challenge.completed ? 'DONE' : 'ATTEMPT'}
              </Text>
            </Pressable>
            <View style={styles.attemptButtonUnderline}></View>
          </View>
        </View>
      </View>

      {/* ImagePickerModal */}
      <ImagePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        image={image}
        description={description}
        setDescription={setDescription}
        isUploading={isUploading}
        handleCameraPress={handleCameraPress}
        handleLibraryPress={handleLibraryPress}
        challengeTitle={challenge.title}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  challengeContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#131F24',
    borderRadius: 18,
    borderColor: '#2F3D45',
    borderWidth: 1,
    minHeight: 185,
  },
  completedContainer: {
    backgroundColor: '#2F3D45',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  challengeImage: {
    width: '30%',
    height: 100,
    borderRadius: 12,
    resizeMode: 'cover',
    marginRight: 10,
  },
  textContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  challengePoints: {
    fontSize: 16,
    color: '#FF9804',
    marginVertical: 8,
    fontWeight: 'bold',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#fff',
    marginVertical: 5,
  },
  attemptButtonContainer: {
    marginTop: 10,
  },
  attemptButton: {
    backgroundColor: '#202F36',
    width: 85,
    height: 25,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  attemptButtonUnderline: {
    width: 85,
    height: 25,
    borderRadius: 8,
    position: 'absolute',
    top: 4,
    backgroundColor: '#18252B',
    zIndex: 0,
  },
  attemptButtonText: {
    color: '#8ac149',
    fontSize: 12,
    fontWeight: 'bold',
  },
  completedText: {
    color: '#48BDF4',
  },
});

export default ChallengeItem;
