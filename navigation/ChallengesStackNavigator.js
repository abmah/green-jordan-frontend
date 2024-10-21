import { createStackNavigator } from '@react-navigation/stack';
import ChallengesScreen from '../screens/ChallengesScreen';
import RedeemScreen from '../screens/RedeemScreen';


const Stack = createStackNavigator();

const ChallengesStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ChallengesScreen" component={ChallengesScreen} />
      <Stack.Screen name="RedeemScreen" component={RedeemScreen} />
    </Stack.Navigator>
  );
};

export default ChallengesStackNavigator;
