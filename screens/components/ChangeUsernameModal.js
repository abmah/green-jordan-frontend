import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have this library for the "X" icon
import { updateUsername } from "../../api";
import useUserIdStore from "../../stores/useUserStore";
import { useQueryClient } from '@tanstack/react-query';
export const ChangeUsernameModal = ({ visible, onClose }) => {
  const { userId } = useUserIdStore();
  const { t } = useTranslation();
  const [newUsername, setNewUsername] = React.useState("");
  const [loading, setLoading] = React.useState(false); // State for loading
  const queryClient = useQueryClient();
  const handleChangeUsername = async () => {
    if (newUsername.trim() === "") {
      Toast.show({
        type: "error",
        text1: t("settings.username_empty_error"),
        position: "bottom",
      });
      return;
    }

    // Set loading to true
    setLoading(true);

    try {
      await updateUsername(newUsername, userId);
      Toast.show({
        type: "success",
        text1: t("settings.username_updated"),
        position: "bottom",
      });
      queryClient.refetchQueries(['fetchUserHomeScreen']);
      queryClient.refetchQueries(['feed']);
      queryClient.refetchQueries(['profile']);


      // Clear the input field
      setNewUsername("");
      onClose();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("settings.username_update_error"),
        position: "bottom",
      });
    } finally {
      // Set loading to false
      setLoading(false);
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#F5F5F5" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{t("settings.change_username")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("settings.new_username")}
            placeholderTextColor="#B3B3B3"
            value={newUsername}
            onChangeText={setNewUsername}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleChangeUsername}
            disabled={loading} // Disable button while loading
          >
            {loading ? ( // Show activity indicator if loading
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>{t("settings.submit")}</Text>
            )}
          </TouchableOpacity>
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
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 20,
    fontFamily: "Nunito-Bold",
    color: "#8AC149",
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
  submitButton: {
    width: "100%",
    backgroundColor: "#8AC149",
    height: 45,
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

export default ChangeUsernameModal;
