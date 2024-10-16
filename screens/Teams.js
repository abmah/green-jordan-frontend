import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView, // ScrollView to allow page refresh
  StyleSheet,
  TouchableOpacity,
  RefreshControl, // RefreshControl for pull-to-refresh
} from "react-native";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

// API calls
import { getAllTeams, createTeam, getUserTeam } from "../api";

// State Management
import useUserStore from "../stores/useUserStore";

// Components
import Loader from "./components/Loader";
import UserTeam from "./components/teams/UserTeam";
import NoTeam from "./components/teams/NoTeam";
import TeamItem from "./components/teams/TeamItem";
import CreateTeamModal from "./components/teams/CreateTeamModal";

const Teams = () => {
  const { userId } = useUserStore();
  const [teams, setTeams] = useState([]);
  const [userTeam, setUserTeam] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // New state for refresh control
  const navigation = useNavigation();

  const fetchTeams = async () => {
    try {
      const response = await getAllTeams();
      if (response.data) {
        setTeams(response.data);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const fetchUserTeam = async () => {
    if (!userId) return setLoading(false); // Early return if userId is not available

    try {
      const response = await getUserTeam(userId);
      if (response.data && response.data.message !== "No team found for this user.") {
        setUserTeam(response.data);
      } else {
        setUserTeam(null);
      }
    } catch (error) {
      console.error("Error fetching user team:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch teams and user team on component mount
  useEffect(() => {
    fetchTeams();
    fetchUserTeam();
  }, [userId]);

  // Handle pull-to-refresh logic
  const onRefresh = async () => {
    setIsRefreshing(true); // Show the refresh spinner
    await fetchTeams();
    await fetchUserTeam(); // Refetch user team
    setIsRefreshing(false); // Hide the refresh spinner
  };

  const handleCreateTeam = async (teamData) => {
    try {
      const response = await createTeam(userId, teamData);
      setTeams((prevTeams) => [...prevTeams, response.data]);
      setUserTeam(response.data);
      setModalVisible(false);
      Toast.show({
        type: "success",
        text1: "Team created successfully!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to create team.",
      });
    }
  };

  const filteredTeams = userTeam
    ? teams.filter((team) => team._id !== userTeam._id)
    : teams;

  const renderTeamItem = (item) => (
    <TeamItem item={item} userId={userId} navigation={navigation} />
  );

  const renderLoginPrompt = () => (
    <View style={styles.loginPromptContainer}>
      <Text style={styles.loginPromptText}>Please log in first.</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={styles.loginButton}
      >
        <Text style={styles.loginButtonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing} // Show the refresh spinner
          onRefresh={onRefresh} // Trigger refresh logic on pull-down
          tintColor="white" // Customize the spinner color
        />
      }
    >
      <View style={styles.container}>
        <Text style={styles.header}>Teams</Text>
        {loading ? (
          <Loader />
        ) : (
          <>
            {userId ? (
              <>
                {userTeam ? (
                  <UserTeam userTeam={userTeam} navigation={navigation} />
                ) : (
                  <NoTeam setModalVisible={setModalVisible} />
                )}
                <Text style={styles.otherTeamsHeader}>Other Teams</Text>
                {filteredTeams.length > 0 ? (
                  filteredTeams.map((team) => (
                    <TeamItem key={team._id} item={team} userId={userId} navigation={navigation} />
                  ))
                ) : (
                  <Text style={{ color: "white" }}>There are no teams</Text>
                )}
              </>
            ) : (
              renderLoginPrompt()
            )}
          </>
        )}
        <CreateTeamModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          handleCreateTeam={handleCreateTeam}
        />
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    backgroundColor: "#0F1F26",
    padding: 16,
    paddingBottom: 0,
  },
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    color: "white",
    marginBottom: 20,
    fontWeight: "bold",
    paddingTop: 40,
  },
  otherTeamsHeader: {
    color: "white",
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  loginPromptContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loginPromptText: {
    color: "white",
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "white",
  },
});

export default Teams;
