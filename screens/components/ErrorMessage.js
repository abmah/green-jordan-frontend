import { Text, StyleSheet, View } from 'react-native';

const Error = ({ message }) => {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Error: {message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Nunito-Regular',
  },
});

export default Error;
