import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { sendJoinRequest } from "../../../api";
import useUserIdStore from "../../../stores/useUserStore";
import Loader from "../Loader";
import Toast from "react-native-toast-message"; // Importing Toast
import { useTranslation } from "react-i18next"; // Import useTranslation
import UserImage from '../../../assets/user.png'
const Overview = ({ teamData, members }) => {
  const { t } = useTranslation(); // Use the translation function
  const { userId } = useUserIdStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showNoMembersMessage, setShowNoMembersMessage] = useState(false);
  const [requestSent, setRequestSent] = useState(false); // New state to track request status

  // Check if the user is a member
  const isMember = teamData.members.some((member) => member._id === userId);
  const isAdmin = teamData.admin === userId;

  // Check if the user has already requested to join
  const hasRequestedJoin = teamData.joinRequests.some(
    (request) => request.userId._id === userId
  );

  const showJoinButton = !isMember && !isAdmin && !hasRequestedJoin && !requestSent;

  const handleJoinRequest = async () => {
    try {
      await sendJoinRequest(teamData._id, userId);
      setRequestSent(true); // Disable the button immediately
      // Display success message using Toast
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Join request sent successfully!",
      });
    } catch (error) {
      console.error("Error sending join request:", error);
      // Display error message using Toast
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to send join request.", // Show error message from server
      });
    }
  };

  const renderMemberItem = ({ item }) => {
    return (
      <View style={styles.memberCard}>
        <Image
          source={{
            uri: item.profilePicture || Image.resolveAssetSource(UserImage).uri,
          }}
          style={styles.profilePicture}
        />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>
            {item.username}
            {item._id === teamData.admin && (
              <Text style={styles.adminLabel}>
                {" "}{t("overview.admin_label")}
              </Text>
            )}
            {item._id === userId && (
              <Text style={styles.youLabel}> - {t("overview.self_label")}</Text>
            )}
            <Text style={styles.pointsLabel}>
              {" "} - {item.points} {t("overview.points")}
            </Text>
          </Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (members.length === 0) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowNoMembersMessage(true);
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
      setShowNoMembersMessage(false);
    }
  }, [members]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("overview.team_overview")}</Text>
      <Text style={styles.details}>
        {t("overview.name")}
        {teamData.name}
      </Text>
      <Text style={styles.details}>
        {t("overview.description")}
        {teamData.description}
      </Text>

      {showJoinButton ? (
        <TouchableOpacity style={styles.joinButton} onPress={handleJoinRequest}>
          <Text style={styles.joinButtonText}>
            {t("overview.send_join_request")}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.disabledJoinButton}>
          <Text style={styles.disabledJoinButtonText}>
            {t("overview.send_join_request")}
          </Text>
        </View>
      )}

      <Text style={styles.membersTitle}>{t("overview.members")}</Text>

      {isLoading ? (
        <Loader />
      ) : showNoMembersMessage ? (
        <Text style={styles.emptyMessage}>
          {t("overview.no_members_found")}
        </Text>
      ) : (
        <FlatList
          data={members}
          renderItem={renderMemberItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.membersList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#0F1F26",
    flex: 1,
  },
  title: {
    fontSize: 26,
    color: "#F5F5F5",
    fontFamily: "Nunito-Bold",
    marginBottom: 16,
  },
  details: {
    fontSize: 16,
    color: "white",
    fontFamily: "Nunito-Bold",
    marginBottom: 8,
  },
  membersTitle: {
    fontSize: 22,
    color: "#F5F5F5",
    fontFamily: "Nunito-ExtraBold",
    marginTop: 20,
    marginBottom: 12,
  },
  membersList: {
    paddingBottom: 16,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B2B38",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderColor: "#ffffff1a",
    borderWidth: 1,
  },
  profilePicture: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    color: "#F5F5F5",
    fontSize: 18,
    fontFamily: "Nunito-SemiBold",
  },
  adminLabel: {
    color: "#FFD700",
    fontSize: 14,
    fontFamily: "Nunito-Bold",
  },
  pointsLabel: {
    color: "white",
    fontSize: 14,
    fontFamily: "Nunito-Bold",
    marginLeft: 4,
  },
  youLabel: {
    color: "#1DB954",
    fontSize: 14,
    fontFamily: "Nunito-ExtraBold",
  },
  emptyMessage: {
    color: "#F5F5F5",
    textAlign: "center",
    marginTop: 20,
  },
  joinButton: {
    backgroundColor: "#8AC149",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  disabledJoinButton: {
    backgroundColor: "#B0B0B0", // Gray background for disabled button
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  disabledJoinButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Nunito-ExtraBold",
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Nunito-ExtraBold",
  },
});

export default Overview;
