import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import useUserStore from "../stores/useUserStore";
import { Ionicons } from "@expo/vector-icons";

const LANGUAGE_STORAGE_KEY = "appLanguage";

const Button = ({ title, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.button, isActive && styles.activeButton]}
    onPress={onPress}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const Settings = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { clearuserId, userId } = useUserStore();

  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [newLanguage, setNewLanguage] = useState(i18n.language);

  const changeLanguage = async (lang) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      i18n.changeLanguage(lang);
      setNewLanguage(lang);
      Toast.show({
        type: "success",
        text1: t("settings.language_changed", {
          lang: lang === "en" ? "English" : "العربية",
        }),
        position: "bottom",
      });
    } catch (error) {
      console.error("Failed to save language to AsyncStorage:", error);
    }
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    Toast.show({
      type: "success",
      text1: t("settings.theme_changed", {
        theme: theme === "dark" ? t("settings.dark") : t("settings.light"),
      }),
      position: "bottom",
    });
  };

  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage) {
          i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error("Failed to load language from AsyncStorage:", error);
      }
    };
    loadSavedLanguage();
  }, []);

  const handleLogout = async () => {
    Alert.alert(t("profile.logout"), t("profile.logoutConfirmation"), [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          await clearuserId();
          await SecureStore.deleteItemAsync("userId");
          Toast.show({
            type: "success",
            text1: t("profile.loggedOutSuccessfully"),
            position: "bottom",
          });
          navigation.navigate("Login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <View style={styles.backButtonHeaderContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#F5F5F5" />
        </TouchableOpacity>
        <Text style={styles.title}>{t("settings.header")}</Text>
      </View>

      {/* Language Selection */}
      <View style={styles.settingContainer}>
        <Text style={styles.settingText}>{t("settings.language")}</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="English"
            isActive={newLanguage === "en"}
            onPress={() => changeLanguage("en")}
          />
          <Button
            title="العربية"
            isActive={newLanguage === "ar"}
            onPress={() => changeLanguage("ar")}
          />
        </View>
      </View>

      {/* Theme Selection */}
      <View style={styles.settingContainer}>
        <Text style={styles.settingText}>{t("settings.theme")}</Text>
        <View style={styles.buttonContainer}>
          <Button
            title={t("settings.dark")}
            isActive={selectedTheme === "dark"}
            onPress={() => handleThemeChange("dark")}
          />
          <Button
            title={t("settings.light")}
            isActive={selectedTheme === "light"}
            onPress={() => handleThemeChange("light")}
          />
        </View>
      </View>

      {/* Logout button */}
      {userId && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>{t("profile.logout")}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: Platform.OS === "android" ? 60 : 0,
    backgroundColor: "#0F1F26",
    flex: 1,
  },
  backButtonHeaderContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  backButton: {
    marginBottom: 16,
    marginRight: 10,
  },
  title: {
    fontSize: 26,
    color: "#F5F5F5",
    fontFamily: "Nunito-Bold",
    marginBottom: 16,
  },
  settingContainer: {
    marginBottom: 32,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#1B2B38",
    padding: 10,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#21603F",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Nunito-Bold",
  },
  settingText: {
    color: "#F5F5F5",
    fontSize: 18,
    fontFamily: "Nunito-Bold",
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: "#1B2B38",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    width: "100%",
  },
  logoutButtonText: {
    color: "#EE5555",
    fontSize: 18,
    fontFamily: "Nunito-Bold",
  },
});

export default Settings;
