import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next"; // Import useTranslation

const NoTeam = ({ setModalVisible }) => {
  const { t } = useTranslation(); // Use translation hook

  return (
    <View style={styles.noTeamContainer}>
      <View style={styles.topSection}>
        <Text style={styles.noTeamText}>{t("noTeam.info")}</Text>
        <Text>{""}</Text>
        <Text style={styles.noTeamText}>{t("noTeam.info2")}</Text>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.createTeamButton}
        >
          <Text style={styles.createTeamButtonText}>
            {t("noTeam.createButton")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  noTeamContainer: {
    backgroundColor: "#213D49",
    borderRadius: 8,
    borderColor: "white",
    padding: 16,
    justifyContent: "space-between",
    marginBottom: 10,
    minHeight: 190,
  },
  topSection: {
    marginBottom: 12, // Add space below the text
  },
  bottomSection: {
    alignItems: "center", // Center the button
  },
  noTeamText: {
    fontFamily: "Nunito-ExtraBold",
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  createTeamButton: {
    backgroundColor: "#38667A", // Button background color
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    width: "100%", // Full width button for better usability
  },
  createTeamButtonText: {
    fontFamily: "Nunito-ExtraBold",
    color: "white", // White text on the button
    fontSize: 16,
  },
});

export default NoTeam;
