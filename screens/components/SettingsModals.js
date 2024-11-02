// UserModals.js
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
          <Text style={styles.modalTitle}>{t("settings.change_username")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("settings.new_username")}
            value={newUsername}
            onChangeText={setNewUsername}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleChangeUsername}
          >
            <Text style={styles.modalButtonText}>{t("settings.submit")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>{t("settings.cancel")}</Text>
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
          <Text style={styles.modalTitle}>{t("settings.change_password")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("settings.old_password")}
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TextInput
            style={styles.input}
            placeholder={t("settings.new_password")}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder={t("settings.confirm_new_password")}
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.modalButtonText}>{t("settings.submit")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>{t("settings.cancel")}</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#1B2B38",
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    color: "#F5F5F5",
    fontFamily: "Nunito-Bold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#21603F",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Nunito-Bold",
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#F5F5F5",
    fontSize: 16,
    fontFamily: "Nunito-Bold",
  },
});
