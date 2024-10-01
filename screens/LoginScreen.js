import { View, Text, TextInput, Pressable, Button } from 'react-native';

const LoginScreen = ({ navigation }) => {

  return (
    <View style={{ padding: 10, flex: 1, backgroundColor: '#f9f9f9' }}>
      <Text>Email</Text>
      <TextInput placeholder='email' style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} type="text" />
      <Text>Password</Text>
      <TextInput placeholder='password' style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} type="text" />
      <Button title="Login" />

      <Text style={{ marginTop: 10 }}>Dont have an account?</Text>
      <Pressable onPress={() => navigation.navigate('Signup')} style={{ marginTop: 10, backgroundColor: 'blue', padding: 10 }}>
        <Text style={{ color: 'white' }}>Signup now</Text>
      </Pressable>

    </View>
  );
};

export default LoginScreen;
