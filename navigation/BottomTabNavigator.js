import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LeaderBoardScreen from "../screens/LeaderBoardScreen";
import ChallengesStackNavigator from "../navigation/ChallengesStackNavigator";
import { useEffect } from "react";
import useUserStore from "../stores/useUserStore";
import Loader from "../screens/components/Loader";
import { Ionicons } from "@expo/vector-icons";
import StackNavigator from "./LoginRegisterStackNavigator";
import TeamsStackNavigator from "./TeamsStackNavigator";
import Settings from "../screens/Settings";
import { useTranslation } from "react-i18next"; // Import useTranslation
import ProfileSettings from './ProfileSettings'

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { userId, getuserId } = useUserStore();
  const { t } = useTranslation(); // Use the translation function

  useEffect(() => {
    const fetchUserId = async () => {
      await getuserId();
    };
    fetchUserId();
  }, [getuserId]);

  if (userId === undefined) {
    return <Loader />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#0F2630" },
        tabBarActiveTintColor: "#8AC149",
        tabBarInactiveTintColor: "#B0BEC5",
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Nunito-ExtraBold",
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarLabel: t("tabs.home"), // Use translation for tab label
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderBoardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
          tabBarLabel: t("tabs.leaderboard"), // Use translation for tab label
        }}
      />
      <Tab.Screen
        name="Challenges"
        component={ChallengesStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flag" size={size} color={color} />
          ),
          tabBarLabel: t("tabs.challenges"), // Use translation for tab label
        }}
      />
      <Tab.Screen
        name="TeamsScreen"
        component={TeamsStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
          tabBarLabel: t("tabs.teams"), // Use translation for tab label
        }}
      />
      <Tab.Screen
        name={userId ? "Profile" : "Login"}
        component={userId ? ProfileSettings : StackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={userId ? "person" : "log-in"}
              size={size}
              color={color}
            />
          ),
          tabBarLabel: userId ? t("tabs.profile") : t("tabs.login"), // Use translation for tab label
        }}
      />
      {/* <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
          tabBarLabel: t("tabs.settings"), // Use translation for tab label
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
