import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import { StatusBar } from "react-native";

export default function App() {
  return (<>
    <StatusBar
      barStyle="light-content"
      backgroundColor="#0F1F26"
      translucent={true}
    />
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  </>

  );
}

