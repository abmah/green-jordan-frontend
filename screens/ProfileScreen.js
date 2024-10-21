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
import { useTranslation } from "react-i18next";
import useUserStore from "../stores/useUserStore";

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
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from '@tanstack/react-query';
// Render stats component
const renderStats = ({ followers, followings, points, t }) => (
  <>
    <Text style={styles.stats}>{`${t("profile.followers")}${followers?.length || 0}`}</Text>
    <Text style={styles.stats}>{`${t("profile.following")}${followings?.length || 0}`}</Text>
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
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalTitle}>
            {t("profile.selectProfilePicture")}
          </Text>
          {image && (
            <Image source={{ uri: image.uri }} style={styles.previewImage} />
          )}
          <View style={styles.imageOptionButtonContainer}>
            <TouchableOpacity onPress={handleCameraPress} style={styles.modalButton}>
              <FontAwesome name="camera" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLibraryPress} style={styles.modalButton}>
              <MaterialIcons name="photo-library" size={24} color="#fff" />
            </TouchableOpacity>

          </View>

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
        </View>
      </View>
    </Modal>
  );
};

// Main ProfileScreen Component
const ProfileScreen = ({ navigation }) => {
  const { userId } = useUserStore();
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);


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

  // Fetch user data


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
    fetchUserData();
  }, []);

  const fetchAll = async () => {
    await Promise.all([fetchUserPosts(), fetchUserData()]);
    return true; // this is spagetti code i know but if i dont have this it will throw an error and i dont want to have to deal with remaking our functions
  };



  useQuery({
    queryKey: ['profile'],
    queryFn: fetchAll,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    refetchOnWindowFocus: false, // Only refetch when manually triggered
  });


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
              uri: userData?.profilePicture || "https://via.placeholder.com/150",
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
            <Ionicons name="settings-sharp" size={24} color="white" />
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
            <RefreshControl refreshing={refreshing} onRefresh={fetchUserPosts} />
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
        t={t}
      />
    </View>
  );
};

// Styles for the ProfileScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1F26",
    paddingVertical: 0,
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
    color: "white",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  stats: {
    fontSize: 16,
    fontFamily: "Nunito-SemiBold",
    color: "white",
  },
  noPostsMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1B2B38",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalHeader: {
    alignItems: "flex-end",
  },
  closeButton: {
    padding: 10,
  },
  modalTitle: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  imageOptionButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  modalButton: {
    backgroundColor: "#121c23",
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    borderRadius: 8,
    width: "45%",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  previewImage: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
  },
  submitButton: {
    width: "100%",

    backgroundColor: "#8AC149",
    height: 45,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    elevation: 2,
    marginTop: 10,
  },
  submitButtonText: {
    color: "#ffffff",
    fontFamily: "Nunito-ExtraBold",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  settingsButtonContainer: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  settingsButton: {


  },
});

export default ProfileScreen;
