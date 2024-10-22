import { createStackNavigator } from "@react-navigation/stack";
import EventsScreen from "../screens/EventsScreen";
import EventDetails from "../screens/components/EventDetails"; // Ensure the path is correct
const Stack = createStackNavigator();

const EventsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Events" component={EventsScreen} />
      <Stack.Screen name="EventDetails" component={EventDetails} />
    </Stack.Navigator>
  );
};

export default EventsStackNavigator;
