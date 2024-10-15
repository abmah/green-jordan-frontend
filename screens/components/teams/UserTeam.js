// UserTeam.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const UserTeam = ({ userTeam, navigation }) => (
  <View style={styles.userTeamContainer}>
    <Text style={styles.yourTeamText}>Your Team:</Text>
    <Text style={styles.userTeamText}>{userTeam.name}</Text>
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("TeamDetails", {
          teamId: userTeam._id,
          isAdmin: true,
        })
      }
      style={styles.manageTeamButton}
    >
      <Text style={styles.manageTeamButtonText}>Manage Team</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  userTeamContainer: {
    marginBottom: 20,
    width: "100%",
    padding: 10,
    backgroundColor: "#1B2B38",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "white",
    minHeight: 150,
    justifyContent: "center",
  },
  yourTeamText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  userTeamText: {
    color: "white",
    fontSize: 16,
  },
  manageTeamButton: {
    backgroundColor: "#FFC7",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  manageTeamButtonText: {
    color: "white",
  },
});

export default UserTeam;
