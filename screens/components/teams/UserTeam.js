import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next"; // Import useTranslation

const UserTeam = ({ userTeam, navigation }) => {
  const { t } = useTranslation(); // Use the translation function

  return (
    <View style={styles.userTeamContainer}>
      {/* Top Section: Team Name and Description */}
      <View style={styles.topSection}>
        <Text style={styles.userTeamTitle}>{userTeam.name}</Text>
        <Text style={styles.userTeamDescription}>
          {userTeam.description || t("userTeam.no_description")}
        </Text>
      </View>

      {/* Bottom Section: Stats and Manage Button */}
      <View style={styles.bottomSection}>
        <View>
          <Text style={styles.memberCount}>
            {t("userTeam.members", { count: userTeam.members.length })}
          </Text>
          <Text style={styles.totalPoints}>
            {t("userTeam.total_points", { points: userTeam.totalPoints || 0 })}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("TeamDetails", { teamId: userTeam._id })
          }
          style={styles.manageTeamButton}
        >
          <Text style={styles.manageTeamButtonText}>
            {t("userTeam.manage_team")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userTeamContainer: {
    marginBottom: 20,
    width: "100%",
    padding: 16,
    backgroundColor: "#213D49",
    borderRadius: 8,
    borderColor: "white",
    minHeight: 190,
    justifyContent: "space-between", // Distribute space between top and bottom
  },
  topSection: {},
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between", // Align stats and button
    alignItems: "flex-end",
    marginTop: 10,
  },
  userTeamTitle: {
    fontFamily: "Nunito-Bold",
    color: "#8AC149", // Green for the title
    fontSize: 24,
    marginBottom: 8,
  },
  userTeamDescription: {
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
  manageTeamButton: {
    backgroundColor: "#38667A", // Button background color
    padding: 10,
    borderRadius: 8,
    width: 130,
    alignItems: "center",
  },
  manageTeamButtonText: {
    fontFamily: "Nunito-ExtraBold",
    color: "white", // White text on the button
    fontSize: 16,
  },
});

export default UserTeam;
