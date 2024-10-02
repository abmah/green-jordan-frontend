import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Signup } from '../api';
import * as SecureStore from 'expo-secure-store';
import useUserStore from '../stores/useUserStore';

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setuserId } = useUserStore();

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await Signup(username, email, password);
      const userId = response.data._id;

      await SecureStore.setItemAsync('userId', userId);
      await setuserId(userId);
      navigation.navigate('Profile');
    } catch (error) {
      console.error('API call error:', error);
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Username</Text>
      <TextInput
        placeholder='Enter your username'
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
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
        <Button title="Signup" onPress={handleSignup} />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.loginText}>Already have an account?</Text>
      <Pressable onPress={() => navigation.navigate('Login Screen')} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login now</Text>
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
  loginText: {
    marginTop: 10,
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: 'blue',
    padding: 10,
  },
  loginButtonText: {
    color: 'white',
  },
});

export default SignupScreen;
