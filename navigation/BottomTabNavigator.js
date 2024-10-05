import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LeaderBoardScreen from '../screens/LeaderBoardScreen';
import StackNavigator from './StackNavigator';
import { useEffect } from 'react';
import useUserStore from '../stores/useUserStore';
import Loader from '../screens/components/Loader';
import ChallengesScreen from '../screens/ChallengesScreen';
import { StatusBar } from 'expo-status-bar';

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
    return (
      <Loader />
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="LeaderBoard" component={LeaderBoardScreen} />
        <Tab.Screen name="Challenges" component={ChallengesScreen} />
        <Tab.Screen options={{ headerShown: false }} name={userId ? "Profile" : "Login"} component={userId ? ProfileScreen : StackNavigator} />
      </Tab.Navigator>
    </>
  );
};



export default BottomTabNavigator;
