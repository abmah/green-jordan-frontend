// CreateTeamModal.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const CreateTeamModal = ({ modalVisible, setModalVisible, handleCreateTeam }) => {
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");

  const onCreateTeam = () => {
    if (!newTeamName || !newTeamDescription) {
      Alert.alert("Error", "Please provide a team name and description.");
      return;
    }
    handleCreateTeam({ name: newTeamName, description: newTeamDescription });
    setNewTeamName("");
    setNewTeamDescription("");
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
          <Text style={styles.modalHeader}>Create New Team</Text>
          <TextInput
            style={styles.input}
            placeholder="Team Name"
            value={newTeamName}
            onChangeText={setNewTeamName}
            placeholderTextColor="white"
          />
          <TextInput
            style={styles.input}
            placeholder="Team Description"
            value={newTeamDescription}
            onChangeText={setNewTeamDescription}
            placeholderTextColor="white"
          />
          <TouchableOpacity
            onPress={onCreateTeam}
            style={styles.createTeamButton}
          >
            <Text style={styles.createTeamButtonText}>Create Team</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    backgroundColor: "#1B2B38",
    borderRadius: 8,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 20,
    color: "white",
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    width: "100%",
    padding: 10,
    marginBottom: 10,
    color: "white",
  },
  createTeamButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  createTeamButtonText: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#FF5733",
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
  },
});

export default CreateTeamModal;
