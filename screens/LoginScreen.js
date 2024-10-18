import React, { useState } from 'react';
import { View, Text, TextInput, Platform, ActivityIndicator, Animated, TouchableOpacity, Easing, Pressable, StyleSheet } from 'react-native';
import { login } from '../api';
import * as SecureStore from 'expo-secure-store';
import useUserStore from '../stores/useUserStore';
import GreenJordan from '../assets/green-jordan.svg';
import MainLogo from '../assets/main-logo.svg';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { Ionicons } from "@expo/vector-icons";
const LoginScreen = ({ navigation }) => {
  const { t } = useTranslation(); // Use the translation function
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
      setError(t("login.login_error")); // Use translation for login error message

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

      <TouchableOpacity onPress={() => navigation.navigate("Settings")} >
        <Ionicons name="settings" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.loginForm}>
        <View style={styles.inputWrapper}>
          <View style={styles.inputUnderline}></View>
          <TextInput
            placeholder={t("login.email_placeholder")} // Use translation for email placeholder
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
            placeholder={t("login.password_placeholder")}
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
              <Text style={styles.loginButtonText}>{t("login.login_button")}</Text>
            </Pressable>
          </Animated.View>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>{t("login.signup_prompt")} </Text>
        <Pressable onPress={() => navigation.navigate("Signup Screen")}>
          <View>
            <Text style={styles.signupButtonText}>{t("login.signup_button")}</Text>
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
    paddingTop: Platform.OS === "android" ? 50 : 0,
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
    paddingRight: 20,
    fontFamily: "Nunito-Regular",
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
    fontFamily: "Nunito-ExtraBold",
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
    fontFamily: "Nunito-Regular",
  },

  signupButtonText: {
    color: "#fff",
    fontSize: 20,
    textDecorationLine: "underline",
    marginLeft: 5,
    fontFamily: "Nunito-ExtraBold",
  },
});

export default LoginScreen;
