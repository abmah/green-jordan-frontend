import { createStackNavigator } from '@react-navigation/stack';
import ChallengesScreen from '../screens/ChallengesScreen';
import Teams from '../screens/components/Teams';
import TeamsDetails from '../screens/components/TeamsDetails';

const Stack = createStackNavigator();

const ChallengesStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ChallengesScreen" component={ChallengesScreen} />
      <Stack.Screen name="Teams" component={Teams} />
      <Stack.Screen name="TeamDetails" component={TeamsDetails} />
    </Stack.Navigator>
  );
};

export default ChallengesStackNavigator;
