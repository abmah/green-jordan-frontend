import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import { getAllTeams, createTeam, getUserTeam } from "../../api";
import useUserStore from "../../stores/useUserStore";
import { useNavigation } from "@react-navigation/native";
import Loader from "./Loader";

const Teams = () => {
  const { userId } = useUserStore();
  const [teams, setTeams] = useState([]);
  const [userTeam, setUserTeam] = useState(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

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

  const handleCreateTeam = async () => {
    if (!newTeamName || !newTeamDescription) {
      Alert.alert("Error", "Please provide a team name and description.");
      return;
    }

    try {
      const teamData = { name: newTeamName, description: newTeamDescription };
      const response = await createTeam(userId, teamData);
      setTeams((prevTeams) => [...prevTeams, response.data]);
      setUserTeam(response.data);
      setModalVisible(false);
      setNewTeamName("");
      setNewTeamDescription("");
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

  // Adjusted filter logic to show all teams if no user team
  const filteredTeams = userTeam
    ? teams.filter((team) => team._id !== userTeam._id)
    : teams;

  const renderTeamItem = ({ item }) => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Teams</Text>
      {loading ? (
        <Loader /> // Show loader while loading data
      ) : (
        <>
          {userTeam ? (
            <View style={styles.userTeamContainer}>
              <Text style={styles.yourTeamText}>Your Team:</Text>
              <Text style={styles.userTeamText}>{userTeam.name}</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("TeamDetails", {
                    teamId: userTeam._id,
                    isAdmin: true,
                  })
                }
                style={styles.manageTeamButton}
              >
                <Text style={styles.manageTeamButtonText}>Manage Team</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noTeamContainer}>
              <Text style={styles.noTeamText}>
                You are not in a team. Either create one or join one - note that
                if you create a team you will not be able to join another.
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.createTeamButton}
              >
                <Text style={styles.createTeamButtonText}>Create Team</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      <Text style={styles.otherTeamsHeader}>Other Teams</Text>
      <FlatList
        data={filteredTeams} // Use the filtered teams list
        renderItem={renderTeamItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
      />

      {/* Modal for creating team */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Create New Team</Text>
            <TextInput
              style={styles.input}
              placeholder="Team Name"
              value={newTeamName}
              onChangeText={setNewTeamName}
              placeholderTextColor="white"
            />
            <TextInput
              style={styles.input}
              placeholder="Team Description"
              value={newTeamDescription}
              onChangeText={setNewTeamDescription}
              placeholderTextColor="white"
            />
            <TouchableOpacity
              onPress={handleCreateTeam}
              style={styles.createTeamButton}
            >
              <Text style={styles.createTeamButtonText}>Create Team</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  noTeamContainer: {
    color: "white",
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    paddingVertical: 20,
  },
  noTeamText: {
    color: "white",
    marginBottom: 10,
    fontSize: 14,
  },
  userTeamContainer: {
    marginBottom: 20,
    width: "100%",
    padding: 10,
    backgroundColor: "#1B2B38",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "white",
    minHeight: 150,
    justifyContent: "center",
  },
  yourTeamText: {
    color: "white",
    fontSize: 14,
  },
  userTeamText: {
    color: "white",
    marginBottom: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    color: "white",
  },
  list: {
    width: "100%",
  },
  teamItem: {
    backgroundColor: "#1B2B38",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderColor: "white",
    borderWidth: 1,
    width: "100%",
  },
  teamName: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  teamDescription: {
    fontSize: 14,
    color: "white",
    marginBottom: 10,
  },
  teamStats: {
    fontSize: 12,
    color: "white",
    marginBottom: 10,
  },
  viewTeamButton: {
    backgroundColor: "#1DB954",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  viewTeamButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  manageTeamButton: {
    backgroundColor: "#0A74DA",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  manageTeamButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  otherTeamsHeader: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#0F1F26",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "white",
  },
  modalHeader: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  createTeamButton: {
    backgroundColor: "#1DB954",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  createTeamButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 16,
    padding: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
  },
});

export default Teams;
