import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import Settings from '../screens/Settings';


const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login Screen" component={LoginScreen} />
      <Stack.Screen name="Signup Screen" component={SignupScreen} />
      <Stack.Screen name="Settings Screen" component={Settings} />
    </Stack.Navigator>
  );
}

export default StackNavigator;