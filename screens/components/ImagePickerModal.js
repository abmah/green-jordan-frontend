import React, { useState } from "react";
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
  I18nManager,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
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
  challenge,
}) => {
  const { t, i18n } = useTranslation();
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const isArabic = i18n.language === "ar";
  I18nManager.allowRTL(isArabic);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            {/* Question Mark Icon with Tooltip */}
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => setTooltipVisible(!tooltipVisible)}
            >
              <AntDesign name="question" size={24} color="#F5F5F5" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#F5F5F5" />
            </TouchableOpacity>
          </View>

          {/* Tooltip for Instructions */}
          {tooltipVisible && (
            <View style={styles.tooltip}>
              {/* Close icon for the tooltip */}
              <TouchableOpacity
                style={styles.tooltipCloseIcon}
                onPress={() => setTooltipVisible(false)}
              >
                <Ionicons name="close" size={24} color="#F5F5F5" />
              </TouchableOpacity>
              <Text style={styles.tooltipText}>
                {t("imagePickerModal.instruction_text")}
                {/* Edit this text in your translation file */}
              </Text>
            </View>
          )}

          {/* Challenge Title */}
          <Text style={styles.modalTitle}>
            {isArabic ? challenge.titleAR : challenge.title}
          </Text>

          <Text style={styles.modalChallengeDescription}>
            {isArabic ? challenge.descriptionAR : challenge.description}
          </Text>

          {/* Image Preview */}
          {image && (
            <Image source={{ uri: image.uri }} style={styles.imagePreview} />
          )}

          {/* Description Input */}
          <TextInput
            placeholder={t("imagePickerModal.caption_placeholder")}
            placeholderTextColor="#B0B0B0"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />

          {/* Buttons */}
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
                <ActivityIndicator size="{small}" color="#fff" />
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
  infoButton: {
    position: "absolute",
    left: -6,
    top: 0,
  },
  closeButton: {
    alignSelf: "flex-end",
    position: "absolute",
    right: -6,
    top: 0,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 20,
    fontFamily: "Nunito-Bold",
    color: "#8AC149",
  },
  modalChallengeDescription: {
    fontSize: 16,
    color: "white",
    fontFamily: "Nunito-Bold",
    marginBottom: 8,
    textAlign: "center",
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
  tooltip: {
    position: "absolute",
    top: 60,
    left: 10,
    backgroundColor: "#1B2B38",
    padding: 10,
    paddingVertical: 40,
    paddingBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2C3E50",
    zIndex: 10,
    width: "100%",
  },
  tooltipText: {
    color: "#F5F5F5",
    fontSize: 16,
    textAlign: "center",
  },
  tooltipCloseIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});

export default ImagePickerModal;
