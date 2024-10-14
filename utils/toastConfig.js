import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const toastConfig = {
  success: ({ text1, text2, ...rest }) => (
    <View style={{ ...styles.toastContainer, backgroundColor: '#28A745' }}>
      <Text style={styles.toastText}>{text1}</Text>
      {text2 ? <Text style={styles.toastText}>{text2}</Text> : null}
    </View>
  ),
  error: ({ text1, text2, ...rest }) => (
    <View style={{ ...styles.toastContainer, backgroundColor: '#DC3545' }}>
      <Text style={styles.toastText}>{text1}</Text>
      {text2 ? <Text style={styles.toastText}>{text2}</Text> : null}
    </View>
  ),
  info: ({ text1, text2, ...rest }) => (
    <View style={{ ...styles.toastContainer, backgroundColor: '#17A2B8' }}>
      <Text style={styles.toastText}>{text1}</Text>
      {text2 ? <Text style={styles.toastText}>{text2}</Text> : null}
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    padding: 16,
    borderRadius: 8,
    minHeight: 60,
    width: '90%', // Wider width for long messages
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default toastConfig;
