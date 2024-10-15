import { createStackNavigator } from '@react-navigation/stack';
import ChallengesScreen from '../screens/ChallengesScreen';


const Stack = createStackNavigator();

const ChallengesStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ChallengesScreen" component={ChallengesScreen} />

    </Stack.Navigator>
  );
};

export default ChallengesStackNavigator;
