import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next"; // Import useTranslation

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation();
  const { t } = useTranslation();

  // Fetch all teams
  const fetchTeams = async () => {
    try {
      const response = await getAllTeams();
      if (response.data) {
        setTeams(response.data);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("teams.error.fetch_teams"),
        text2: error.message || t("teams.error.default_message"),
      });
    }
  };

  // Fetch user team
  const fetchUserTeam = async () => {
    if (!userId) return setLoading(false);

    try {
      const response = await getUserTeam(userId);
      if (response.data && response.data.message !== "No team found for this user.") {
        setUserTeam(response.data);
      } else {
        setUserTeam(null);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("teams.error.fetch_user_team"),
        text2: error.message || t("teams.error.default_message"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchUserTeam();
  }, [userId]);

  // Handle team creation
  const handleCreateTeam = async (teamData) => {
    try {
      const response = await createTeam(userId, teamData);
      setTeams((prevTeams) => [...prevTeams, response.data]);
      setUserTeam(response.data);
      setModalVisible(false);
      Toast.show({
        type: "success",
        text1: t("teams.success.create_team"),
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("teams.error.create_team"),
        text2: error.message || t("teams.error.default_message"),
      });
    }
  };

  const filteredTeams = userTeam
    ? teams.filter((team) => team._id !== userTeam._id)
    : teams;

  const renderContent = () => {
    if (!userId) {
      return renderLoginPrompt();
    }
    if (loading) {
      return <Loader />;
    }
    return (
      <>
        {userTeam ? (
          <UserTeam userTeam={userTeam} navigation={navigation} />
        ) : (
          <NoTeam setModalVisible={setModalVisible} />
        )}
        <Text style={styles.otherTeamsHeader}>{t("teams.other_teams")}</Text>
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <TeamItem key={team._id} item={team} userId={userId} navigation={navigation} />
          ))
        ) : (
          <Text style={{ color: "white" }}>{t("teams.no_teams")}</Text>
        )}
      </>
    );
  };

  const renderLoginPrompt = () => (
    <View style={styles.loginPromptContainer}>
      <Text style={styles.loginPromptText}>{t("teams.login_prompt")}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={styles.loginButton}
      >
        <Text style={styles.loginButtonText}>{t("teams.login_button")}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={async () => {
            setIsRefreshing(true);
            await fetchTeams();
            await fetchUserTeam();
            setIsRefreshing(false);
          }}
          tintColor="white"
        />
      }
    >
      <View style={styles.container}>
        {userId && <Text style={styles.header}>{t("teams.header")}</Text>}
        {renderContent()}
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
    flex: 1,
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
