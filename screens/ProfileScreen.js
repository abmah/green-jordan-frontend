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
    <Text style={styles.stats}>{`${t("profile.followers")}${followers?.length || 0
      }`}</Text>
    <Text style={styles.stats}>{`${t("profile.following")}${followings?.length || 0
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
  const { clearuserId, userId } = useUserStore();
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

  const handleLogout = async () => {
    Alert.alert(t("profile.logout"), t("profile.logoutConfirmation"), [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          await clearuserId();
          Alert.alert(t("profile.loggedOutSuccessfully"));
          await SecureStore.deleteItemAsync("userId");
        },
      },
    ]);
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
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.errorLogoutButton}
        >
          <Text style={styles.logoutText}>{t("profile.logout")}</Text>
        </TouchableOpacity>
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
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>{t("profile.logout")}</Text>
        </TouchableOpacity>
        <TouchableOpacity

          onPress={() => navigation.navigate("Settings")}
        >

          <Ionicons name="settings" size={20} color="white" />

        </TouchableOpacity>
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
  logoutButton: {
    position: "absolute",
    right: 20,
    top: 10,
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  statsContainer: {
    alignItems: "center",
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stats: {
    color: "#ffffff",
    fontSize: 16,
    marginVertical: 5,
  },
  noPostsMessage: {
    color: "#ffffff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  postsContainer: {
    // marginHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
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
    marginVertical: 20,
  },
  submitButton: {
    backgroundColor: "#00A9C5",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    color: "#00A9C5",
    marginTop: 10,
  },
  errorText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F1F26",
  },
  errorLogoutButton: {
    marginTop: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },

  loadingText: {
    color: "#00A9C5",
    marginTop: 10,
  },
});

export default ProfileScreen;
