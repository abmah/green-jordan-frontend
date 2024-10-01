import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';


const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login Screen" component={LoginScreen} />
      <Stack.Screen name="Signup Screen" component={SignupScreen} />
    </Stack.Navigator>
  );
}

export default StackNavigator;