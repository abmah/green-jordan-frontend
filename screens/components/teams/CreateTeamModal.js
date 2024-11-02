import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { Ionicons } from "@expo/vector-icons"; // Added for close button icon

const CreateTeamModal = ({
  modalVisible,
  setModalVisible,
  handleCreateTeam,
}) => {
  const { t } = useTranslation();
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const onCreateTeam = async () => {
    if (!newTeamName || !newTeamDescription) {
      Alert.alert(t("createTeam.error"), t("createTeam.missingFields"));
      return;
    }
    setLoading(true); // Start loading
    try {
      await handleCreateTeam({
        name: newTeamName,
        description: newTeamDescription,
      });
      setNewTeamName("");
      setNewTeamDescription("");
      setModalVisible(false); // Close the modal on success
    } catch (error) {
      Alert.alert(
        t("createTeam.error"),
        error.message || t("createTeam.failed")
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t("createTeam.header")}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#F5F5F5" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSection}>
            <TextInput
              style={styles.input}
              placeholder={t("createTeam.teamName")}
              value={newTeamName}
              onChangeText={setNewTeamName}
              placeholderTextColor="#B0B0B0"
            />
            <TextInput
              style={styles.input}
              placeholder={t("createTeam.teamDescription")}
              value={newTeamDescription}
              onChangeText={setNewTeamDescription}
              placeholderTextColor="#B0B0B0"
            />
            <TouchableOpacity
              onPress={onCreateTeam}
              style={
                loading
                  ? styles.disabledCreateTeamButton
                  : styles.createTeamButton
              } // Conditional styling
              disabled={loading} // Disable button while loading
            >
              <Text style={styles.createTeamButtonText}>
                {loading
                  ? t("createTeam.loading")
                  : t("createTeam.createButton")}
              </Text>
            </TouchableOpacity>
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
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "Nunito-Bold",
    color: "#8AC149",
    marginBottom: 10,
    marginTop: 30,

    width: "100%",
    textAlign: "center",
  },
  bottomSection: {
    width: "100%",
    alignItems: "center",
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
  createTeamButton: {
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
  disabledCreateTeamButton: {
    width: "100%",
    backgroundColor: "#B0B0B0",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 10,
  },
  createTeamButtonText: {
    color: "#ffffff",
    fontFamily: "Nunito-ExtraBold",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  closeButtonText: {
    fontFamily: "Nunito-ExtraBold",
    color: "white",
    fontSize: 16,
  },
});

export default CreateTeamModal;
