import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Signup } from "../api";
import * as SecureStore from "expo-secure-store";
import useUserStore from "../stores/useUserStore";

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setuserId } = useUserStore();

  const buttonOffset = useState(new Animated.Value(0))[0];

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await Signup(username, email, password);
      const userId = response.data._id;

      await SecureStore.setItemAsync("userId", userId);
      await setuserId(userId);
      navigation.navigate("Profile");
    } catch (error) {
      console.error("API call error:", error);
      setError("Signup failed. Please try again.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

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
      handleSignup();
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.signUpTitle}>
        <Text style={styles.signUpText}>Sign up</Text>
      </View>
      <View style={styles.signupForm}>
        <View style={styles.inputWrapper}>
          <View style={styles.inputUnderline}></View>
          <TextInput
            placeholder="Username"
            placeholderTextColor={"#000"}
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
        </View>
        <View style={styles.inputWrapper}>
          <View style={styles.inputUnderline}></View>
          <TextInput
            placeholder="Email"
            placeholderTextColor={"#000"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
          />
        </View>
        <View style={styles.inputWrapper}>
          <View style={styles.inputUnderline}></View>
          <TextInput
            placeholder="Password"
            placeholderTextColor={"#000"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>
      </View>
      <View style={styles.signUpButtonContainer}>
        {loading ? null : <View style={styles.signUpButtonUnderline}></View>}
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
              style={styles.signUpButton}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.signUpButtonText}>Signup</Text>
            </Pressable>
          </Animated.View>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <Pressable
          onPress={() => navigation.navigate("Login Screen")}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Login now</Text>
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

  signUpTitle: {
    marginVertical: 80,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  signUpText: {
    fontSize: 48,
    color: "#8AC149",
  },

  signupForm: {
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

  buttonAnimation: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  signUpButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  signUpButton: {
    width: "100%",
    backgroundColor: "#8AC149",
    borderRadius: 75,
    maxWidth: 320,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
  },

  signUpButtonText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
  },

  signUpButtonUnderline: {
    width: "100%",
    height: 55,
    backgroundColor: "#3E600F",
    maxWidth: 320,
    position: "absolute",
    top: 4,
    borderRadius: 75,
  },

  errorText: {
    color: "#ff4d4d",
    marginTop: 12,
    textAlign: "center",
    fontSize: 16,
  },

  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "100%",
  },

  loginText: {
    fontSize: 20,
    color: "#ffffff",
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 20,
    textDecorationLine: "underline",
    marginLeft: 5,
  },
});

export default SignupScreen;
