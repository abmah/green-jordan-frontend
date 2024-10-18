import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useTranslation } from "react-i18next"; // Import useTranslation
import useUserStore from "../stores/useUserStore";
import * as SecureStore from "expo-secure-store";
import { getSelf } from "../api/self";
import { getUserPosts } from "../api/post";
import Post from "./components/Post";
import { updateProfilePicture } from "../api/user";
import {
  requestCameraPermissions,
  pickImage,
} from "./components/ImagePickerHandler";
import { Ionicons } from "@expo/vector-icons";
import Loader from "./components/Loader";

// Render stats component
const renderStats = ({ followers, followings, points, t }) => (
  <>
    <Text style={styles.stats}>{`${t("profile.followers")}${
      followers?.length || 0
    }`}</Text>
    <Text style={styles.stats}>{`${t("profile.following")}${
      followings?.length || 0
    }`}</Text>
    <Text style={styles.stats}>{`${t("profile.points")}${points || 0}`}</Text>
  </>
);

// Render no posts message component
const renderNoPostsMessage = (t) => (
  <Text style={styles.noPostsMessage}>{t("profile.noPostsMessage")}</Text>
);

// Custom Image Picker Modal
const CustomImagePickerModal = ({
  visible,
  onClose,
  onSubmit,
  image,
  handleCameraPress,
  handleLibraryPress,
  isUploading,
  t,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {t("profile.selectProfilePicture")}
          </Text>
          <TouchableOpacity onPress={handleCameraPress}>
            <Text style={styles.modalButton}>{t("profile.takePhoto")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLibraryPress}>
            <Text style={styles.modalButton}>
              {t("profile.chooseFromLibrary")}
            </Text>
          </TouchableOpacity>
          {image && (
            <Image source={{ uri: image.uri }} style={styles.previewImage} />
          )}
          <TouchableOpacity
            onPress={onSubmit}
            style={styles.submitButton}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>{t("profile.upload")}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>{t("profile.close")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Main ProfileScreen Component
const ProfileScreen = ({ navigation }) => {
  const { userId } = useUserStore();
  const { t } = useTranslation(); // Use translation hook
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getSelf();
        setUserData(data.user);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Fetch user posts
  const fetchUserPosts = useCallback(async () => {
    if (!userId) return;
    setRefreshing(true);
    try {
      const response = await getUserPosts(userId);
      if (response) {
        setUserPosts(response.data.length === 0 ? [] : response.data);
      }
    } catch (postError) {
      console.error("Error fetching user posts:", postError);
      setError(postError);
    } finally {
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  // Handle image selection from the library
  const handleLibraryPress = async () => {
    await pickImage("library", setSelectedImage);
  };

  // Handle camera press
  const handleCameraPress = async () => {
    const granted = await requestCameraPermissions();
    if (granted) {
      await pickImage("camera", setSelectedImage);
    }
  };

  // Handle profile picture update
  const handleProfilePictureUpdate = async () => {
    if (!selectedImage) {
      Alert.alert(t("profile.noImageSelected"));
      return;
    }

    setIsUploading(true);
    try {
      await updateProfilePicture(selectedImage, userId);
      const updatedData = await getSelf();
      setUserData(updatedData.user);
      setModalVisible(false);
      setSelectedImage(null);
      Alert.alert(t("profile.profileUpdated"));
    } catch (err) {
      console.error(
        "Error updating profile picture:",
        err.response ? err.response.data : err.message
      );
      Alert.alert(t("profile.failedToUpdateProfile"));
    } finally {
      setIsUploading(false);
    }
  };

  // Handle loading state
  if (loading) {
    return <Loader />;
  }

  // Handle error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {t("profile.errorFetchingProfile")}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri:
                userData?.profilePicture || "https://via.placeholder.com/150",
            }}
            style={styles.profilePicture}
          />
          <TouchableOpacity
            style={styles.editIconContainer}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="pencil" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.settingsButtonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Settings")}
            style={styles.settingsButton}
          >
            <Ionicons name="settings" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.username}>{userData?.username}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        {userData && renderStats({ ...userData, t })}
      </View>

      {userPosts.length === 0 ? (
        renderNoPostsMessage(t)
      ) : (
        <FlatList
          data={userPosts}
          renderItem={({ item }) => <Post post={item} />}
          keyExtractor={(item) => item._id}
          style={styles.postsContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchUserPosts}
            />
          }
        />
      )}

      <CustomImagePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleProfilePictureUpdate}
        image={selectedImage}
        handleCameraPress={handleCameraPress}
        handleLibraryPress={handleLibraryPress}
        isUploading={isUploading}
        t={t} // Pass translation function
      />
    </View>
  );
};

// Styles for the ProfileScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1F26",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F1F26",
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1C4B5640",
    position: "relative",
  },
  profileImageContainer: {
    position: "relative",
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#00A9C5",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#00A9C5",
    borderRadius: 45,
    padding: 4,
  },
  username: {
    fontSize: 24,
    fontFamily: "Nunito-ExtraBold",
    marginTop: 10,
    color: "#ffffff",
  },
  settingsButtonContainer: {
    position: "absolute",
    top: 0,
    right: 20,
    flexDirection: "row",
  },
  settingsButton: {
    marginLeft: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  stats: {
    marginHorizontal: 10,
    fontSize: 14,
    fontFamily: "Nunito-Bold",
    color: "#ffffff",
  },
  postsContainer: {
    paddingHorizontal: 20,
  },
  noPostsMessage: {
    textAlign: "center",
    marginTop: 50,
    fontFamily: "Nunito-Bold",
    color: "#ffffff",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    fontSize: 16,
    color: "#00A9C5",
    marginVertical: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: "#00A9C5",
    padding: 10,
    borderRadius: 10,
    width: 100,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    fontSize: 16,
    color: "#ff5c5c",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F1F26",
  },
  errorText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default ProfileScreen;
