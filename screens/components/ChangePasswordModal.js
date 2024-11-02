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
import { Ionicons } from "@expo/vector-icons";
import useUserIdStore from "../../stores/useUserStore";
import { updatePassword } from "../../api";

export const ChangePasswordModal = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false); // State for loading
  const { userId } = useUserIdStore();

  const handleChangePassword = async () => {
    if (
      oldPassword.trim() === "" ||
      newPassword.trim() === "" ||
      confirmNewPassword.trim() === ""
    ) {
      Toast.show({
        type: "error",
        text1: t("settings.password_empty_error"),
        position: "bottom",
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Toast.show({
        type: "error",
        text1: t("settings.password_mismatch"),
        position: "bottom",
      });
      return;
    }
    if (oldPassword === newPassword) { // Check if old and new passwords are the same
      Toast.show({
        type: "error",
        text1: t("settings.password_same_error"), // Ensure you have this translation key
        position: "bottom",
      });
      return;
    }

    // Set loading to true
    setLoading(true);

    try {
      await updatePassword(oldPassword, newPassword, userId);
      Toast.show({
        type: "success",
        text1: t("settings.password_updated"),
        position: "bottom",
      });

      // Clear the form fields
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      onClose();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("settings.password_update_error"),
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
          <Text style={styles.modalTitle}>{t("settings.change_password")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("settings.old_password")}
            placeholderTextColor="#B3B3B3"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TextInput
            style={styles.input}
            placeholder={t("settings.new_password")}
            placeholderTextColor="#B3B3B3"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder={t("settings.confirm_new_password")}
            placeholderTextColor="#B3B3B3"
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleChangePassword}
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

export default ChangePasswordModal;
