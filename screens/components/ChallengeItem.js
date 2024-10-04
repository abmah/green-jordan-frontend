import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Animated,
  Image,
  Alert,
} from 'react-native';
import { createPost } from '../../api/post';
import { requestCameraPermissions, pickImage } from './ImagePickerHandler';

const ChallengeItem = ({ challenge, userId }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
      await createPost(description, userId, image);
      setDescription('');
      setImage(null);
      setModalVisible(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [modalVisible]);

  return (
    <View style={styles.challengeContainer}>
      <Text style={styles.challengeTitle}>{challenge.title}</Text>
      <Text style={styles.challengePoints}>Points: {challenge.points}</Text>
      <Pressable
        style={({ pressed }) => [styles.attemptButton, pressed && styles.buttonPressed]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.attemptButtonText}>Attempt Challenge</Text>
      </Pressable>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <Text style={styles.modalTitle}>{challenge.title}</Text>
            <Text style={styles.modalDescription}>{challenge.description}</Text>
            <Text style={styles.modalPoints}>Points: {challenge.points}</Text>
            {image && (
              <Image
                source={{ uri: image.uri }}
                style={styles.imagePreview}
              />
            )}
            <TextInput
              placeholder="Enter description for your activity..."
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />
            <View style={styles.buttonContainer}>
              <Pressable style={styles.modalButton} onPress={handleCameraPress}>
                <Text style={styles.modalButtonText}>Take a Photo</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={handleLibraryPress}>
                <Text style={styles.modalButtonText}>Select from Library</Text>
              </Pressable>
            </View>
            <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={isUploading}>
              {isUploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Proof</Text>
              )}
            </Pressable>
            <Pressable style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  challengeContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderColor: '#3D85C6',
    borderWidth: 3,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F2F2F',
  },
  challengePoints: {
    fontSize: 16,
    color: '#28A745',
    marginVertical: 8,
    fontWeight: 'bold',
  },
  attemptButton: {
    borderWidth: 2,
    borderColor: '#28A745',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#28A745',
    elevation: 2,
  },
  attemptButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '95%',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 10,
  },
  modalDescription: {
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  modalPoints: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
  },
  imagePreview: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginVertical: 10,
    resizeMode: 'cover',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    color: '#333',
    fontSize: 16,
    width: '100%',
    backgroundColor: '#F8F8F8',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
    elevation: 2,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalCloseButton: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
});
export default ChallengeItem;
