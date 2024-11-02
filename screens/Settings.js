// Settings.js
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
import ChangeUsernameModal from './components/ChangeUsernameModal';
import ChangePasswordModal from './components/ChangePasswordModal';


const LANGUAGE_STORAGE_KEY = "appLanguage";

// Button Component
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
  const { clearuserId } = useUserStore();

  const [newLanguage, setNewLanguage] = useState(i18n.language);

  // State for modals
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

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
        <Text style={styles.headerText}>{t("settings.header")}</Text>
      </View>

      {/* Language Selection */}
      <Text style={styles.sectionTitle}>{t("settings.language")}</Text>
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

      {/* Username and Password Change */}
      <Text style={styles.sectionTitle}>
        {t("settings.account_management")}
      </Text>
      <View style={styles.modalButtonContainer}>
        <TouchableOpacity
          style={styles.changeButton}
          onPress={() => setUsernameModalVisible(true)}
        >
          <Text style={styles.buttonText}>{t("settings.change_username")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.changeButton}
          onPress={() => setPasswordModalVisible(true)}
        >
          <Text style={styles.buttonText}>{t("settings.change_password")}</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>{t("settings.logout")}</Text>
      </TouchableOpacity>

      {/* Modals */}
      <ChangeUsernameModal
        visible={usernameModalVisible}
        onClose={() => setUsernameModalVisible(false)}
        onChange={(newUsername) => {
          Toast.show({
            type: "success",
            text1: t("settings.username_changed", { username: newUsername }),
            position: "bottom",
          });
        }}
      />
      <ChangePasswordModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
        onChange={(oldPassword, newPassword) => {
          Toast.show({
            type: "success",
            text1: t("settings.password_changed"),
            position: "bottom",
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0F1F26",
  },
  backButtonHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Platform.OS === "android" ? 20 : 0,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    color: "#F5F5F5",
    fontFamily: "Nunito-Bold",
  },
  sectionTitle: {
    fontSize: 18,
    color: "#F5F5F5",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "#2C3E50",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",

  },
  activeButton: {
    backgroundColor: "#21603F",
  },
  buttonText: {
    color: "#F5F5F5",
    fontFamily: "Nunito-Bold",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  changeButton: {
    flex: 1,
    backgroundColor: "#2C3E50",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",

  },
  logoutButton: {
    backgroundColor: "#2C3E50",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#EE5555",
    fontSize: 16,
    fontFamily: "Nunito-Bold",
  },
});

export default Settings;
