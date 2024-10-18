import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from 'react-native-toast-message'; // Import Toast
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const LANGUAGE_STORAGE_KEY = 'appLanguage'; // Key for storing the language in AsyncStorage

const Settings = () => {
  const { t, i18n } = useTranslation();

  // Function to change the language and store it in AsyncStorage
  const changeLanguage = async (lang) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang); // Save selected language
      i18n.changeLanguage(lang);

      // Display a toast message when the language changes
      Toast.show({
        type: 'success',
        text1: t("settings.language_changed", {
          lang: lang === "en" ? "English" : "العربية",
        }),
        position: 'bottom',
      });
    } catch (error) {
      console.error('Failed to save language to AsyncStorage:', error);
    }
  };

  // Load the saved language from AsyncStorage when the component mounts
  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage); // Apply the saved language
      }
    } catch (error) {
      console.error('Failed to load language from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    loadSavedLanguage(); // Load saved language on component mount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("settings.header")}</Text>

      <Text style={styles.sectionTitle}>{t("settings.language")}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => changeLanguage("en")}
      >
        <Text style={styles.buttonText}>English</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => changeLanguage("ar")}
      >
        <Text style={styles.buttonText}>العربية</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>{t("settings.other_settings")}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          {t("settings.notification_preferences")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>{t("settings.privacy_settings")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          {t("settings.account_management")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#0F1F26",
    flex: 1,
  },
  title: {
    fontSize: 26,
    color: "#F5F5F5",
    fontFamily: "Nunito-Bold",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    color: "#F5F5F5",
    fontFamily: "Nunito-ExtraBold",
    marginTop: 20,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#1B2B38",
    padding: 10,
    borderRadius: 8,
    marginVertical: 6,
  },
  buttonText: {
    color: "#F5F5F5",
    fontSize: 16,
    fontFamily: "Nunito-SemiBold",
  },
});

export default Settings;
