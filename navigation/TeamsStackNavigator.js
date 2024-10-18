import { createStackNavigator } from "@react-navigation/stack";
import Teams from "../screens/Teams";
import TeamsDetails from "../screens/components/teams/TeamsDetails";

const Stack = createStackNavigator();

const TeamsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Teams" component={Teams} />
      <Stack.Screen name="TeamDetails" component={TeamsDetails} />
    </Stack.Navigator>
  );
};

export default TeamsStackNavigator;
