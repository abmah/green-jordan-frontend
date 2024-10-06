import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, Animated, Easing, Pressable, StyleSheet } from 'react-native';
import { login } from '../api';
import * as SecureStore from 'expo-secure-store';
import useUserStore from '../stores/useUserStore';
import GreenJordan from '../assets/green-jordan.svg'
import MainLogo from '../assets/main-logo.svg'

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
      setError('*Login failed. Please check your credentials and try again.');


      setTimeout(() => {
        setError(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };



  const buttonOffset = useState(new Animated.Value(0))[0];

  const handlePressIn = () => {
    Animated.timing(buttonOffset, {
      toValue: 4,
      duration: 0,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(buttonOffset, {
      toValue: 0,
      duration: 0,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      handleLogin();
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logosContainer}>
        <MainLogo width={220} height={220} style={{ marginBottom: 40 }} />
        <GreenJordan width={230} height={30} style={{ marginBottom: 30 }} />
      </View>
      <View style={styles.loginForm}>
        <View style={styles.inputWrapper}>
          <View style={styles.inputUnderline}></View>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor={"#000"}
          />
        </View>
        <View style={styles.inputWrapper}>
          <View style={styles.inputUnderline}></View>
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholderTextColor={"#000"}
          />
        </View>
      </View>
      <View style={styles.loginButtonContainer}>
        {loading ? null : <View style={styles.loginButtonUnderline}></View>}
        {loading ? (
          <ActivityIndicator size="large" color="#8AC149" />
        ) : (
          <Animated.View
            style={[
              styles.buttonAnimation,
              { transform: [{ translateY: buttonOffset }] },
            ]}
          >
            <Pressable
              style={styles.loginButton}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>
          </Animated.View>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <Pressable onPress={() => navigation.navigate("Signup Screen")}>
          <View>
            <Text style={styles.signupButtonText}>Sign up!</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1F26",
  },

  logosContainer: {
    alignItems: "center",
    marginTop: 80,
  },

  loginForm: {
    marginBottom: 10,
  },

  inputWrapper: {
    alignItems: "center",
  },

  inputUnderline: {
    width: "100%",
    height: 60,
    backgroundColor: "#3E600F",
    maxWidth: 320,
    position: "absolute",
    top: 4,
    borderRadius: 75,
  },

  input: {
    paddingLeft: 20,
    fontSize: 18,
    width: "100%",
    maxWidth: 320,
    height: 60,
    backgroundColor: "#ffffff",
    color: "#0F1F26",
    borderRadius: 75,
    marginBottom: 30,
  },

  errorText: {
    color: "#ff4d4d",
    marginTop: 12,
    textAlign: "center",
    fontSize: 16,
  },

  loginButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  loginButtonUnderline: {
    width: "100%",
    height: 55,
    backgroundColor: "#3E600F",
    maxWidth: 320,
    position: "absolute",
    top: 4,
    borderRadius: 75,
  },

  buttonAnimation: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  loginButton: {
    width: "100%",
    backgroundColor: "#8AC149",
    borderRadius: 75,
    maxWidth: 320,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
  },

  loginButtonText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
  },

  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "100%",
  },

  signupText: {
    fontSize: 20,
    color: "#ffffff",
  },

  signupButtonText: {
    color: "#fff",
    fontSize: 20,
    textDecorationLine: "underline",
    marginLeft: 5,
  },
});

export default LoginScreen;
