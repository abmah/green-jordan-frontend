import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getTeamMembers, getTeam } from "../../../api";
import useUserIdStore from "../../../stores/useUserStore";
import TeamPosts from "./TeamPosts";
import ManageTeam from "./ManageTeam";
import Overview from "./Overview";
import CustomTabBar from "./CustomTabBar";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons
import Toast from "react-native-toast-message"; // Import Toast

const Tab = createBottomTabNavigator();

const TeamDetailsTabs = () => {
  const { userId } = useUserIdStore();
  const route = useRoute();
  const navigation = useNavigation(); // Get the navigation object
  const { teamId } = route.params;
  const { t } = useTranslation();

  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    members: [],
    joinRequests: [],
  });
  const [members, setMembers] = useState([]);
  const [isInTeam, setIsInTeam] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const teamResponse = await getTeam(teamId);
        if (teamResponse.data) {
          setTeamData(teamResponse.data);
          setIsInTeam(teamResponse.data.members.includes(userId));
          setIsAdmin(teamResponse.data.admin === userId);

          const membersResponse = await getTeamMembers(teamId);
          if (membersResponse.data) {
            setMembers(membersResponse.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch team data", error);
        // Show error message using Toast
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message || "Failed to fetch team data.",
        });
      }
    };

    fetchTeamData();
  }, [teamId, userId]);

  return (
    <View style={{ flex: 1 }}>
      {/* Header with Back Button */}
      <View style={styles.teamHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Navigate back to the previous screen
        >
          <Ionicons name="arrow-back" size={24} color="#F5F5F5" />
        </TouchableOpacity>
      </View>

      <Tab.Navigator
        screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen
          name="Overview"
          options={{ tabBarLabel: t("teamDetails.overview") }}
        >
          {() => <Overview teamData={teamData} members={members} />}
        </Tab.Screen>

        <Tab.Screen
          name="Posts"
          options={{ tabBarLabel: t("teamDetails.team_posts") }}
        >
          {() => <TeamPosts teamId={teamId} />}
        </Tab.Screen>

        {isAdmin && (
          <Tab.Screen
            name="Manage"
            options={{ tabBarLabel: t("teamDetails.manage_team") }}
          >
            {() => (
              <ManageTeam
                teamData={teamData}
                teamId={teamId}
                members={members}
                isInTeam={isInTeam}
                setIsInTeam={setIsInTeam}
                setMembers={setMembers}
                setTeamData={setTeamData}
              />
            )}
          </Tab.Screen>
        )}
      </Tab.Navigator>


    </View>
  );
};

const styles = StyleSheet.create({
  teamHeader: {
    backgroundColor: "#0F1F26",
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomColor: "#1C4B5640",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamName: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  teamDescription: {
    fontSize: 16,
    color: "#B0B0B0",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default TeamDetailsTabs;
