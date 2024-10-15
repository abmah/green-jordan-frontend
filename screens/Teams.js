import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

// API calls
import { getAllTeams, createTeam, getUserTeam } from "../api";

// State Management
import useUserStore from "../stores/useUserStore";

// Components
import Loader from "./components/Loader";
import UserTeam from "./components/UserTeam";
import NoTeam from "./components/NoTeam";
import TeamItem from "./components/TeamItem";
import CreateTeamModal from "./components/CreateTeamModal";

const Teams = () => {
  const { userId } = useUserStore();
  const [teams, setTeams] = useState([]);
  const [userTeam, setUserTeam] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
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

    fetchTeams();
    fetchUserTeam();
  }, [userId]);

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

  const renderTeamItem = ({ item }) => (
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
              <FlatList
                data={filteredTeams}
                renderItem={renderTeamItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={{ color: 'white' }}>There are no teams</Text>}
              />
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
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#0F1F26",
    padding: 16,
    paddingBottom: 0,
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
  list: {
    paddingBottom: 20,
  },
});

export default Teams;
