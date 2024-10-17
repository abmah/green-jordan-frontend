// Settings.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    Alert.alert('Language changed', `Language set to ${lang === 'en' ? 'English' : 'Arabic'}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.sectionTitle}>Language</Text>
      <TouchableOpacity style={styles.button} onPress={() => changeLanguage('en')}>
        <Text style={styles.buttonText}>English</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => changeLanguage('ar')}>
        <Text style={styles.buttonText}>Arabic</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Other Settings</Text>
      {/* Fake settings options */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Notification Preferences</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Privacy Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Account Management</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#0F1F26',
    flex: 1,
  },
  title: {
    fontSize: 26,
    color: '#F5F5F5',
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#F5F5F5',
    fontFamily: 'Nunito-ExtraBold',
    marginTop: 20,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1B2B38',
    padding: 10,
    borderRadius: 8,
    marginVertical: 6,
  },
  buttonText: {
    color: '#F5F5F5',
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
  },
});

export default Settings;
