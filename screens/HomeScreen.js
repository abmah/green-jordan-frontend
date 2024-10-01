import { View, Text } from 'react-native';
import StackNavigator from '../components/StackNavigator';

const HomeScreen = () => {
  return (
    <View>
      <StackNavigator />
      <Text>Home Screen</Text>
    </View>
  );
};

export default HomeScreen;
