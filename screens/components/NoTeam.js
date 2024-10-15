// NoTeam.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const NoTeam = ({ setModalVisible }) => (
  <View style={styles.noTeamContainer}>
    <Text style={styles.noTeamText}>
      You are not in a team. Either create one or join one - note that
      if you create a team you will not be able to join another.
    </Text>
    <TouchableOpacity
      onPress={() => setModalVisible(true)}
      style={styles.createTeamButton}
    >
      <Text style={styles.createTeamButtonText}>Create Team</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  noTeamContainer: {
    color: "white",
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    paddingVertical: 20,
  },
  noTeamText: {
    color: "white",
    marginBottom: 10,
    fontSize: 14,
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
});

export default NoTeam;
