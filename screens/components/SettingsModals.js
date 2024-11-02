import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have this library for the "X" icon

export const ChangeUsernameModal = ({ visible, onClose, onChange }) => {
  const { t } = useTranslation();
  const [newUsername, setNewUsername] = React.useState("");

  const handleChangeUsername = () => {
    if (newUsername.trim() === "") {
      Toast.show({
        type: "error",
        text1: t("settings.username_empty_error"),
        position: "bottom",
      });
      return;
    }
    onChange(newUsername);
    onClose();
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
          >
            <Text style={styles.submitButtonText}>{t("settings.submit")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export const ChangePasswordModal = ({ visible, onClose, onChange }) => {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");

  const handleChangePassword = () => {
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
    onChange(oldPassword, newPassword);
    onClose();
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
          >
            <Text style={styles.submitButtonText}>{t("settings.submit")}</Text>
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

export default { ChangeUsernameModal, ChangePasswordModal };
