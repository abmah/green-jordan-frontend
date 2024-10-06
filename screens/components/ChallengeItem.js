import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { createPost } from '../../api/post';
import { requestCameraPermissions, pickImage } from './ImagePickerHandler';
import Foundation from '@expo/vector-icons/Foundation';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const ChallengeItem = ({ challenge, userId, fetchChallenges }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [instructionsVisible, setInstructionsVisible] = useState(false); // State for instructions modal

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

      {/* Challenge Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setInstructionsVisible(true)} style={styles.helpIcon}>
                <Ionicons name="help" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>

            </View>
            <Text style={styles.modalTitle}>{challenge.title}</Text>
            {image && (
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
            )}
            <TextInput
              placeholder="Write a caption"
              placeholderTextColor="#000"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />
            <View style={styles.buttonContainer}>
              <View style={styles.imageOptionButtonContainer}>
                <Pressable style={styles.modalButton} onPress={handleCameraPress}>
                  <FontAwesome name="camera" size={24} color="#0f1f26" />
                </Pressable>
                <Pressable style={styles.modalButton} onPress={handleLibraryPress}>
                  <MaterialIcons name="photo-library" size={24} color="#0f1f26" />
                </Pressable>
              </View>
              <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={isUploading}>
                {isUploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>SUBMIT</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Instructions Modal */}
      <Modal
        transparent={true}
        visible={instructionsVisible}
        onRequestClose={() => setInstructionsVisible(false)}
      >
        <View style={styles.modalContainer}>

          <View style={[styles.modalContent, styles.instructionsModalContent]}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setInstructionsVisible(false)}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.instructionsText}>
              <Text style={styles.instructionsTitle}>Instructions</Text>
              <Text style={styles.instructions}>
                Take a clear photo of the challenge with yourself visible. Poor quality or fake submissions
                may result in dismissal or a ban.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
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

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },

  modalContent: {
    width: '80%',
    height: 270,
    backgroundColor: '#37464F',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  instructions: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    color: '#fff',
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

    padding: 10,
    marginBottom: 20,
    borderRadius: 30,
    color: '#000',
    fontSize: 16,
    width: '100%',
    backgroundColor: '#fff',

  },
  buttonContainer: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',

  },
  imageOptionButtonContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    // width: '50%',
    gap: 10,
  },
  modalButton: {
    backgroundColor: '#1E90FF',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderRadius: 8,
    width: 130
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  submitButton: {
    width: 130,
    backgroundColor: '#8AC149',
    height: 45,
    alignSelf: "flex-end",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalCloseButton: {
    backgroundColor: '#ff4d4d',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  instructionsModalContent: {

  },
  helpIcon: {
    alignSelf: 'flex-start',
  },
  instructionsText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: "100%",

  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructions: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',

  },

});

export default ChallengeItem;
