// ImagePickerModal.js

import React from 'react';
import { Modal, View, Pressable, Text, Image, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const ImagePickerModal = ({
  visible,
  onClose,
  onSubmit,
  image,
  description,
  setDescription,
  isUploading,
  handleCameraPress,
  handleLibraryPress,
  challengeTitle,
}) => {
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalTitle}>{challengeTitle}</Text>

          {image && <Image source={{ uri: image.uri }} style={styles.imagePreview} />}

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
            <Pressable style={styles.submitButton} onPress={onSubmit} disabled={isUploading}>
              {isUploading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitButtonText}>SUBMIT</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    minHeight: 270,
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
    justifyContent: 'space-between',
    width: '100%',
  },
  imageOptionButtonContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    backgroundColor: '#1E90FF',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderRadius: 8,
    width: 130,
  },
  submitButton: {
    width: 130,
    backgroundColor: '#8AC149',
    height: 45,
    alignSelf: 'flex-end',
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
});

export default ImagePickerModal;
