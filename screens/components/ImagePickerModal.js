import React from "react";
import {
  Modal,
  View,
  Pressable,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

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
  challengeTitle, // New prop for challenge title
  showDescription, // Indicates whether to show the description input
}) => {
  const { t } = useTranslation();

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#F5F5F5" />
            </TouchableOpacity>
          </View>

          {/* Challenge Title */}
          <Text style={styles.modalTitle}>{challengeTitle}</Text>

          {/* Image Preview */}
          {image && <Image source={{ uri: image.uri }} style={styles.imagePreview} />}

          {/* Description Input */}
          {showDescription && (
            <TextInput
              placeholder={t("imagePickerModal.caption_placeholder")}
              placeholderTextColor="#B0B0B0"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <View style={styles.imageOptionButtonContainer}>
              <Pressable style={styles.modalButton} onPress={handleCameraPress}>
                <FontAwesome name="camera" size={24} color="#fff" />
              </Pressable>
              <Pressable style={styles.modalButton} onPress={handleLibraryPress}>
                <MaterialIcons name="photo-library" size={24} color="#fff" />
              </Pressable>
            </View>
            <Pressable
              style={styles.submitButton}
              onPress={onSubmit}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {t("imagePickerModal.submit")}
                </Text>
              )}
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
    justifyContent: "center",
    alignItems: "center",

  },
  modalContent: {
    width: "80%",
    backgroundColor: "#1B2B38",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  closeButton: {
    alignSelf: "flex-end",
    position: "absolute",
    right: 0,
    top: 0,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 20,
    fontFamily: "Nunito-Bold",
    color: "#8AC149",
  },
  imagePreview: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginVertical: 10,
    resizeMode: "cover",
  },
  input: {
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    color: "#F5F5F5",
    fontSize: 16,
    width: "100%",
    backgroundColor: "#2C3E50",
    fontFamily: "Nunito-Medium",
  },
  buttonContainer: {
    justifyContent: "space-between",
    width: "100%",

  },
  imageOptionButtonContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",


  },
  modalButton: {
    backgroundColor: "#121c23",
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    borderRadius: 8,
    width: "45%",

  },
  submitButton: {
    width: "100%",
    backgroundColor: "#8AC149",
    height: 45,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    elevation: 2,
    marginTop: 10,
  },
  submitButtonText: {
    color: "#ffffff",
    fontFamily: "Nunito-ExtraBold",
    fontSize: 16,
  },
});

export default ImagePickerModal;
