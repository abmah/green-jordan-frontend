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
import { useTranslation } from "react-i18next"; // Import useTranslation

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
  const { t } = useTranslation(); // Use the translation function

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#F5F5F5" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalTitle}>{challengeTitle}</Text>

          {image && (
            <Image source={{ uri: image.uri }} style={styles.imagePreview} />
          )}

          <TextInput
            placeholder={t("imagePickerModal.caption_placeholder")}
            placeholderTextColor="#B0B0B0"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />

          <View style={styles.buttonContainer}>
            <View style={styles.imageOptionButtonContainer}>
              <Pressable style={styles.modalButton} onPress={handleCameraPress}>
                <FontAwesome name="camera" size={24} color="#fff" />
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={handleLibraryPress}
              >
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
    backgroundColor: "rgba(15, 31, 38, 0.8)", // Dimmed background
  },
  modalContent: {
    width: "90%", // Increased width for better layout
    minHeight: 320, // Increased minimum height
    backgroundColor: "#2C3E50", // Darker background for the modal
    borderRadius: 15,
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
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: "Nunito-ExtraBold", // Font consistency
    color: "#F5F5F5",
    marginBottom: 10,
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
    borderRadius: 30,
    color: "#000",
    fontSize: 16,
    width: "100%",
    backgroundColor: "#fff",
    fontFamily: "Nunito-Medium",
  },
  buttonContainer: {
    justifyContent: "space-between",
    width: "100%",
  },
  imageOptionButtonContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#1E90FF", // Consistent button color
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    borderRadius: 8,
    width: "45%", // Responsive button width
    marginHorizontal: 5, // Spacing between buttons
  },
  submitButton: {
    width: "100%", // Full width for the submit button
    backgroundColor: "#8AC149", // Consistent submit button color
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
    fontFamily: "Nunito-ExtraBold", // Font consistency
    fontSize: 16,
  },
});

export default ImagePickerModal;
