import { View, Text, TextInput, Pressable, Button, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import Loader from './components/Loader';
import Error from './components/ErrorMessage';
import useFetch from '../api/useFetch';
import { login } from '../api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await login(email, password);
      setData(response);
    } catch (error) {
      console.error('API call error:', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <View style={{ padding: 10, flex: 1, backgroundColor: '#f9f9f9' }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        placeholder='email'
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        onChangeText={(text) => setEmail(text)}
        keyboardType='email-address' // Better user experience for email input
        autoCapitalize='none'
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        placeholder='password'
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry // Hide password input
      />

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <Button onPress={submit} title="Login" />
      )}

      {error && (
        <Error message={error} /> // Assuming Error component displays the error message
      )}

      <Text style={{ marginTop: 10 }}>Don't have an account?</Text>
      <Pressable onPress={() => navigation.navigate('Signup')} style={{ marginTop: 10, backgroundColor: 'blue', padding: 10 }}>
        <Text style={{ color: 'white' }}>Signup now</Text>
      </Pressable>

      {
        data && (
          <View style={{ marginTop: 20 }}>
            <Text>{JSON.stringify(data)}</Text>
          </View>
        )
      }
    </View>
  );
};

export default LoginScreen;
