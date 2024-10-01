import { View, Text } from 'react-native';
import StackNavigator from '../navigation/StackNavigator';

const HomeScreen = () => {
  return (
    <View>
      <StackNavigator />
      <Text>Home Screen</Text>
    </View>
  );
};

export default HomeScreen;
