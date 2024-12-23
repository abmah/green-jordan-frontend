import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity,
} from "react-native";
import useUserStore from "../stores/useUserStore";
import ChallengeItem from "./components/ChallengeItem";
import { getDailyChallenges } from "../api";
import Loader from "./components/Loader";
import { getSelf } from "../api/self";
import { useTranslation } from "react-i18next"; // Import useTranslation
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useQuery } from "@tanstack/react-query";

const ChallengesScreen = ({ navigation }) => {
  const { t } = useTranslation(); // Use the translation function
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const { userId } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);





  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const { dailyChallenges } = await getDailyChallenges(userId);
      setDailyChallenges(dailyChallenges);
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
      setDailyChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await getSelf();
      setUserData(response.user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUserData(null);
    }
  };



  useEffect(() => {
    if (userId) {
      fetchChallenges();
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const queryFetchUserData = () => {
    fetchUserData();
    return true;
  };

  useQuery({
    queryKey: ["challenge-user-data"],
    queryFn: queryFetchUserData,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    refetchOnWindowFocus: false, // Only refetch when manually triggered
  });

  if (!userId) {
    return (
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
  }

  if (loading) {
    return <Loader />;
  }

  const renderHeader = () => (
    <>
      {userData && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.streakText}>
            {t("challenges.current_streak", { streak: userData.streak })}
          </Text>
          <Text style={styles.pointsText}>
            {t("challenges.total_points", { points: userData.points })}
          </Text>
          <Text style={styles.lastChallengeText}>
            {t("challenges.last_challenge_completed", {
              date: userData.lastChallengeCompleted
                ? new Date(userData.lastChallengeCompleted).toLocaleDateString()
                : t("challenges.never"),
            })}
          </Text>
          <Text style={styles.challengesAssignedText}>
            {t("challenges.challenges_assigned_today", {
              count: userData.dailyChallengesAssigned.length,
            })}
          </Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("RedeemScreen")}
              style={styles.redeemButton}
            >
              <MaterialIcons name="redeem" size={24} color="#FF9804" />
              <Text style={styles.redeemText}>{t("challenges.redeem")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("EventsStackNavigator")}
              style={styles.eventsButton}
            >
              <MaterialIcons name="event" size={24} color="#FF9804" />
              <Text style={styles.redeemText}>{t("challenges.events")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );

  const renderItem = ({ item }) => (
    <View style={styles.challengeSection}>
      <ChallengeItem
        navigation={navigation}
        challenge={item}
        userId={userId}
        fetchChallenges={fetchChallenges}
        fetchUserData={fetchUserData}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={dailyChallenges}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <Text style={styles.noChallengesText}>
            {t("challenges.no_challenges")}
          </Text>
        }
        stickyHeaderIndices={[0]}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001c2c",
  },
  userInfoContainer: {
    paddingTop: Platform.OS === "android" ? 60 : 0,
    marginBottom: 20,
    padding: 20,
    paddingBottom: 0,
    backgroundColor: "#1E2D3A",
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  redeemButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#131F24",
    borderRadius: 8,
    marginVertical: 20,
    marginHorizontal: 10,
    width: "45%",
  },
  eventsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#131F24",
    borderRadius: 8,
    marginVertical: 20,
    marginHorizontal: 10,
    width: "45%",
  },
  redeemText: {
    color: "#FF9804",
    fontSize: 16,
    fontFamily: "Nunito-ExtraBold",
    textTransform: "uppercase",
    marginLeft: 8, // Spacing between icon and text
  },

  streakText: {
    fontSize: 28, // Increased font size for emphasis
    fontFamily: "Nunito-Black",
    color: "#FF9804",
    marginBottom: 8,
  },
  pointsText: {
    fontSize: 18,
    fontFamily: "Nunito-ExtraBold",
    color: "#FF9804",
    marginBottom: 8,
  },
  lastChallengeText: {
    fontSize: 16,
    fontFamily: "Nunito-SemiBold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  challengesAssignedText: {
    fontSize: 16,
    fontFamily: "Nunito-SemiBold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  loginPromptContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F1F26",
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
  loginPrompt: {
    fontSize: 20,
    fontFamily: "Nunito-ExtraBold",
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 20,
  },
  challengeSection: {
    paddingHorizontal: 20,
  },
  noChallengesText: {
    fontSize: 16,
    fontFamily: "Nunito-SemiBold",
    color: "#999",
    textAlign: "center",
    marginTop: 30,
  },
});

export default ChallengesScreen;
