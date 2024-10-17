import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next"; // Import useTranslation

const TeamItem = ({ item, userId, navigation }) => {
  const { t } = useTranslation(); // Use the translation function
  const isAdmin = item.admin === userId;
  const membersCount = item.members.length;

  return (
    <View style={styles.teamItem}>
      {/* Top Section: Team Name and Description */}
      <View style={styles.topSection}>
        <Text style={styles.teamName}>{item.name}</Text>
        <Text style={styles.teamDescription}>{item.description}</Text>
      </View>

      {/* Bottom Section: Stats and Action Button */}
      <View style={styles.bottomSection}>
        <View>
          {/* Member Count and Total Points */}
          <Text style={styles.memberCount}>
            {t("team_item.member_count")} {membersCount}
          </Text>
          <Text style={styles.totalPoints}>
            {t("team_item.total_points")} {item.totalPoints || 0}
          </Text>
        </View>

        {/* View or Manage Team Button */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("TeamDetails", { teamId: item._id, isAdmin })
          }
          style={styles.actionButton}
        >
          <Text style={styles.actionButtonText}>
            {isAdmin ? t("team_item.manage_team") : t("team_item.view_team")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  teamItem: {
    backgroundColor: "#213D49",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    borderColor: "white",
    minHeight: 190,
    justifyContent: "space-between", // Distribute space between top and bottom
  },
  topSection: {
    // This wraps the title and description
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between", // Space between stats and button
    alignItems: "flex-end", // Align items at the bottom
    marginTop: 10,
  },
  teamName: {
    fontFamily: "Nunito-Black",
    color: "#8AC149", // Green for the title
    fontSize: 24,
    marginBottom: 8,
  },
  teamDescription: {
    fontFamily: "Nunito-ExtraBold",
    color: "white",
    fontSize: 16,
    marginBottom: 12,
  },
  memberCount: {
    fontFamily: "Nunito-ExtraBold",
    color: "#fff5", // Grey for the member count
    fontSize: 16,
  },
  totalPoints: {
    fontFamily: "Nunito-ExtraBold",
    color: "#8AC149", // Green for total points
    fontSize: 16,
    marginTop: 4,
  },
  actionButton: {
    backgroundColor: "#8AC149", // Green button background
    padding: 10,
    borderRadius: 30,
    width: 130,
    alignItems: "center",
  },
  actionButtonText: {
    fontFamily: "Nunito-ExtraBold",
    color: "white", // White text on the button
    fontSize: 16,
  },
});

export default TeamItem;
