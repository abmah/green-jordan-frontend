import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
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

const Settings = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { clearuserId, userId } = useUserStore();

  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [newLanguage, setNewLanguage] = useState(i18n.language); // Track selected language in modal
  const [newTheme, setNewTheme] = useState(selectedTheme); // Track selected theme in modal

  const changeLanguage = async (lang) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      i18n.changeLanguage(lang);

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

    // Logic to apply the theme can be added here
  };

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

  useEffect(() => {
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

  const handleLanguageSelect = () => {
    changeLanguage(newLanguage);
    setLanguageModalVisible(false);
  };

  const handleThemeSelect = () => {
    handleThemeChange(newTheme);
    setThemeModalVisible(false);
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

      {/* Language button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setLanguageModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {t("settings.language")}:{" "}
          {newLanguage === "en" ? "English" : "العربية"}
        </Text>
      </TouchableOpacity>

      {/* Theme button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setThemeModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {t("settings.theme")}:{" "}
          {newTheme === "dark" ? t("settings.dark") : t("settings.light")}
        </Text>
      </TouchableOpacity>

      {/* Logout button */}
      {userId && (
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>{t("profile.logout")}</Text>
        </TouchableOpacity>
      )}

      {/* Language Selection Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t("settings.language")}</Text>
            <TouchableOpacity onPress={() => setNewLanguage("en")}>
              <Text style={styles.modalOption}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNewLanguage("ar")}>
              <Text style={styles.modalOption}>العربية</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setLanguageModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>
                  {t("settings.cancel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleLanguageSelect}
              >
                <Text style={styles.modalButtonText}>{t("settings.ok")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Theme Selection Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={themeModalVisible}
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t("settings.theme")}</Text>
            <TouchableOpacity onPress={() => setNewTheme("dark")}>
              <Text style={styles.modalOption}>{t("settings.dark")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNewTheme("light")}>
              <Text style={styles.modalOption}>{t("settings.light")}</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setThemeModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>
                  {t("settings.cancel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleThemeSelect}
              >
                <Text style={styles.modalButtonText}>{t("settings.ok")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: "space-between",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    color: "#F5F5F5",
    fontFamily: "Nunito-Bold",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#1B2B38",
    padding: 20,
    borderRadius: 8,
    marginVertical: 12,
  },
  buttonText: {
    color: "#F5F5F5",
    fontSize: 18,
    fontFamily: "Nunito-SemiBold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#37464F",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Nunito-Bold",
    marginBottom: 20,
  },
  modalOption: {
    fontSize: 18,
    marginVertical: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#1B2B38",
    padding: 10,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default Settings;
