import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const NoTeam = ({ setModalVisible }) => (
  <View style={styles.noTeamContainer}>
    {/* Top Section: Informational Text */}
    <View style={styles.topSection}>
      <Text style={styles.noTeamText}>
        You are not in a team. Either create one or join one. Note that
        if you create a team, you will not be able to join another.
      </Text>
    </View>

    {/* Bottom Section: Create Team Button */}
    <View style={styles.bottomSection}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.createTeamButton}
      >
        <Text style={styles.createTeamButtonText}>Create Team</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  noTeamContainer: {
    backgroundColor: "#213D49", // Dark background for the container
    borderRadius: 8,
    borderColor: "white",
    padding: 16,
    justifyContent: "space-between", // Space between the top and bottom sections
    marginBottom: 10, // Add spacing between multiple components
    minHeight: 190,
  },
  topSection: {
    marginBottom: 12, // Add space below the text
  },
  bottomSection: {
    alignItems: "center", // Center the button
  },
  noTeamText: {
    fontFamily: 'Nunito-ExtraBold',
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  createTeamButton: {
    backgroundColor: "#38667A", // Green button background
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    width: '100%', // Full width button for better usability
  },
  createTeamButtonText: {
    fontFamily: 'Nunito-ExtraBold',
    color: "white", // White text on the button
    fontSize: 16,
  },
});

export default NoTeam;
