import { createStackNavigator } from '@react-navigation/stack';
import Settings from '../screens/Settings';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const TeamsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};

export default TeamsStackNavigator;
