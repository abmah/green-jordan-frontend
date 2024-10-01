import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import LeaderBoardScreen from '../screens/LeaderBoardScreen';
import StackNavigator from './StackNavigator';

const Tab = createBottomTabNavigator();



const BottomTabNavigator = () => {
  return (
    <>
      <Tab.Navigator >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="LeaderBoard" component={LeaderBoardScreen} />
        <Tab.Screen name="Stack" component={StackNavigator} />
      </Tab.Navigator>
    </>
  );
};

export default BottomTabNavigator;
