import { View, Text, TextInput, Button } from 'react-native';

const SignupScreen = ({ navigation }) => {
  return (
    <View style={{ padding: 10, flex: 1, backgroundColor: '#f9f9f9' }}>
      <Text>Username</Text>
      <TextInput placeholder='username' style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} type="text" />
      <Text>Email</Text>
      <TextInput placeholder='email' style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} type="text" />
      <Text>Password</Text>
      <TextInput placeholder='password' style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} type="text" />
      <Button title="Signup" />
    </View>
  );
};

export default SignupScreen;
