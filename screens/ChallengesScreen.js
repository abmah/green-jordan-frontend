import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import useUserStore from '../stores/useUserStore';
import { createPost } from '../api/post';
import { requestCameraPermissions, pickImage } from './components/ImagePickerHandler';

const ChallengesScreen = () => {
  const { userId } = useUserStore();
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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
      const response = await createPost(description, userId, image);
      setDescription('');
      setImage(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={styles.loginPrompt}>Please login first</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post Something</Text>
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Pressable style={({ pressed }) => [styles.imageButton, pressed && styles.buttonPressed]} onPress={handleCameraPress}>
          <Text style={styles.buttonText}>Take a Photo</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.imageButton, pressed && styles.buttonPressed]} onPress={handleLibraryPress}>
          <Text style={styles.buttonText}>Select from Library</Text>
        </Pressable>
      </View>
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={styles.image}
        />
      )}
      {isUploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Pressable
          style={({ pressed }) => [styles.submitButton, pressed && styles.buttonPressed]}
          onPress={handleSubmit}
          disabled={isUploading}
        >
          <Text style={styles.submitButtonText}>Create Post</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  submitButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    alignSelf: 'center',
  },
  loginPrompt: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ChallengesScreen;
