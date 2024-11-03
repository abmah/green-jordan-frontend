import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import {
  acceptJoinRequest,
  rejectJoinRequest,
  removeMember,
} from "../../../api";
import useUserIdStore from "../../../stores/useUserStore";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next"; // Import translation function


const ManageTeam = ({ teamData, teamId, members, setMembers, setTeamData }) => {

  const { userId } = useUserIdStore();
  const { t } = useTranslation(); // Initialize translation function

  const handleUpdateJoinRequest = async (action, request) => {
    const requestUserId = request.userId;
    const username = request.userId.username;
    try {
      if (action === "Accepted") {
        await acceptJoinRequest(teamId, requestUserId._id, userId);

        // Show success toast
        Toast.show({
          type: "success",
          text1: t("manage_team.success.join_request_accepted"), // Use translation
        });

        const newMember = { _id: requestUserId, username };
        setMembers((prevMembers) => [...prevMembers, newMember]);

        const updatedJoinRequests = teamData.joinRequests.filter(
          (req) => req._id !== request._id
        );
        setTeamData({ ...teamData, joinRequests: updatedJoinRequests });
      } else if (action === "Denied") {
        await rejectJoinRequest(teamId, requestUserId._id, userId);

        // Show success toast
        Toast.show({
          type: "success",
          text1: t("manage_team.success.join_request_denied"), // Use translation
        });

        const updatedJoinRequests = teamData.joinRequests.filter(
          (req) => req._id !== request._id
        );
        setTeamData({ ...teamData, joinRequests: updatedJoinRequests });
      }
    } catch (error) {
      // Show error toast
      Toast.show({
        type: "error",
        text1: t("manage_team.error.join_request_error"), // Use translation
        text2: error.response.data.message,
      });
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await removeMember(teamId, memberId, userId);
      // Show success toast
      Toast.show({
        type: "success",
        text1: t("manage_team.success.member_removed"), // Use translation
      });
      setMembers(members.filter((member) => member._id !== memberId));
    } catch (error) {
      // Show error toast
      Toast.show({
        type: "error",
        text1: t("manage_team.error.member_removal_error"), // Use translation
        text2: "Failed to remove member. Please try again.", // Optional additional message
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{t("manage_team.header")}</Text>
      {teamData.joinRequests.length > 0 ? (
        teamData.joinRequests.map((request) => (
          <View key={request._id} style={styles.requestContainer}>
            {request.userId.profilePicture &&
              request.userId.profilePicture !== "" ? (
              <Image
                source={{ uri: request.userId.profilePicture }}
                style={styles.profilePicture}
              />
            ) : (
              <Image
                source={require("../../../assets/default-avatar.png")}
                style={styles.profilePicture}
              />
            )}
            <Text style={styles.requestText}>
              Username: {request.userId.username}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.acceptButton]}
                onPress={() => handleUpdateJoinRequest("Accepted", request)}
              >
                <Text style={styles.buttonText}>
                  {t("manage_team.accept_button")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.denyButton]}
                onPress={() => handleUpdateJoinRequest("Denied", request)}
              >
                <Text style={styles.buttonText}>
                  {t("manage_team.deny_button")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noRequests}>{t("manage_team.no_requests")}</Text>
      )}
      <Text style={styles.membersHeader}>
        {t("manage_team.members_header")}
      </Text>
      {members.length > 0 ? (
        members.map((member) => (
          <View key={member._id} style={styles.memberContainer}>
            {member.profilePicture && member.profilePicture !== "" ? (
              <Image
                source={{ uri: member.profilePicture }}
                style={styles.profilePicture}
              />
            ) : (
              <Image
                source={require("../../../assets/user.png")}
                style={styles.profilePicture}
              />
            )}
            <Text style={styles.memberText}>
              {t("manage_team.username")}
              {member.username}
            </Text>
            {member._id !== userId ? (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveMember(member._id)}
              >
                <Text style={styles.buttonText}>
                  {t("manage_team.remove_button")}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.selfLabel}>
                {t("manage_team.self_label")}
              </Text>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noMembers}>{t("manage_team.no_members")}</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#0F1F26",
    flex: 1,
  },
  header: {
    fontSize: 26,
    color: "#F5F5F5",
    fontWeight: "700",
    marginBottom: 16,
  },
  requestContainer: {
    padding: 12,
    backgroundColor: "#1C2A33",
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  requestText: {
    color: "#B0B0B0",
    flex: 1,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
    elevation: 2,
    alignItems: "center",
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: "#1DB954",
  },
  denyButton: {
    backgroundColor: "#FF3D00",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  noRequests: {
    color: "#B0B0B0",
    textAlign: "center",
    marginTop: 10,
  },
  memberContainer: {
    padding: 12,
    backgroundColor: "#1C2A33",
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  membersHeader: {
    fontSize: 22,
    color: "#F5F5F5",
    marginBottom: 10,
    marginTop: 20,
  },
  memberText: {
    color: "#B0B0B0",
    flex: 1,
  },
  removeButton: {
    marginHorizontal: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FF3D00",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  noMembers: {
    color: "#B0B0B0",
    textAlign: "center",
    marginTop: 10,
  },
  profilePicture: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  selfLabel: {
    color: "#1DB954",
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default ManageTeam;
