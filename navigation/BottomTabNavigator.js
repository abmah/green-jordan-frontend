import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LeaderBoardScreen from "../screens/LeaderBoardScreen";
import StackNavigator from "./StackNavigator";
import { useEffect } from "react";
import useUserStore from "../stores/useUserStore";
import Loader from "../screens/components/Loader";
import ChallengesScreen from "../screens/ChallengesScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { userId, getuserId } = useUserStore();

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
          fontWeight: "900",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderBoardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Challenges"
        component={ChallengesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flag" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={userId ? "Profile" : "Login"}
        component={userId ? ProfileScreen : StackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={userId ? "person" : "log-in"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;