import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { login } from '../api';
import * as SecureStore from 'expo-secure-store';
import useUserStore from '../stores/useUserStore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setuserId } = useUserStore();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await login(email, password);
      const userId = response.data._id;
      await SecureStore.setItemAsync('userId', userId);
      await setuserId(userId);
      navigation.navigate('Profile');
    } catch (error) {
      console.error('API call error:', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email</Text>
      <TextInput
        placeholder='Enter your email'
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <Text>Password</Text>
      <TextInput
        placeholder='Enter your password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.signupText}>Don't have an account?</Text>
      <Pressable onPress={() => navigation.navigate('Signup Screen')} style={styles.signupButton}>
        <Text style={styles.signupButtonText}>Signup now</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  signupText: {
    marginTop: 10,
  },
  signupButton: {
    marginTop: 10,
    backgroundColor: 'blue',
    padding: 10,
  },
  signupButtonText: {
    color: 'white',
  },
});

export default LoginScreen;
