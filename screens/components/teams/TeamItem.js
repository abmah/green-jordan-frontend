// TeamItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TeamItem = ({ item, userId, navigation }) => {
  const isAdmin = item.admin === userId;

  const membersCount = item.members.length;

  return (
    <View style={styles.teamItem}>
      <Text style={styles.teamName}>{item.name}</Text>
      <Text style={styles.teamDescription}>{item.description}</Text>
      <Text style={styles.teamStats}>
        Members: {membersCount} | Points: {item.totalPoints || 0}
      </Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("TeamDetails", { teamId: item._id, isAdmin })
        }
        style={styles.viewTeamButton}
      >
        <Text style={styles.viewTeamButtonText}>View Team</Text>
      </TouchableOpacity>
      {isAdmin && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("TeamDetails", { teamId: item._id, isAdmin })
          }
          style={styles.manageTeamButton}
        >
          <Text style={styles.manageTeamButtonText}>Manage Team</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  teamItem: {
    backgroundColor: "#1B2B38",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "white",
  },
  teamName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  teamDescription: {
    color: "white",
    marginTop: 5,
    marginBottom: 10,
  },
  teamStats: {
    color: "white",
    fontSize: 14,
  },
  viewTeamButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  viewTeamButtonText: {
    color: "white",
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

export default TeamItem;
