
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const requestCameraPermissions = async () => {
  const { granted } = await ImagePicker.requestCameraPermissionsAsync();
  if (!granted) {
    Alert.alert('Permission to access the camera is required!');
  }
  return granted;
};

export const pickImage = async (source, setImage) => {
  const result = source === 'camera'
    ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1 })
    : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1 });

  if (!result.canceled) {
    setImage(result.assets[0]);
  }
};
