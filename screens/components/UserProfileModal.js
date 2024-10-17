import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { getFullUser } from '../../api'; // Import your getUser API function
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon library
import { useTranslation } from 'react-i18next'; // Import useTranslation for translations

const UserProfileView = ({ userId, visible, onClose }) => {
  const { t } = useTranslation(); // Use the translation hook
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && visible) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const response = await getFullUser(userId);
          setUserData(response.data);
        } catch (error) {
          console.error("Failed to fetch user data", error);
          Alert.alert("Error", t("userProfile.error_fetch"));
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [userId, visible]);

  const renderPost = ({ item }) => <View></View>;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#00A9C5" />
        ) : (
          <>
            <View style={styles.profileContainer}>
              <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon name="close" size={30} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.profileHeader}>
                <Image
                  source={{ uri: userData?.profilePicture || 'https://via.placeholder.com/150' }}
                  style={styles.profileImage}
                />
                <Text style={styles.username}>{userData?.username}</Text>
              </View>

              <View style={styles.statsContainer}>
                <Text style={styles.stats}>{t("userProfile.points")}: {userData?.points || 0}</Text>
                <Text style={styles.stats}>{t("userProfile.followers")}: {userData?.followers.length || 0}</Text>
                <Text style={styles.stats}>{t("userProfile.following")}: {userData?.followings.length || 0}</Text>
              </View>
            </View>

            <FlatList
              data={userData?.posts}
              renderItem={renderPost}
              keyExtractor={(post) => post._id}
              style={styles.postsList}
            />
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1F26',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    padding: 10,
  },
  profileHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1C4B5640',
    paddingBottom: 10
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#00A9C5',
  },
  username: {
    fontSize: 24,
    fontFamily: 'Nunito-ExtraBold',
    color: '#ffffff',
    marginBottom: 5,
    marginTop: 10
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    paddingBottom: 10
  },
  stats: {
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'Nunito-ExtraBold',
  },
  postsList: {
    marginTop: 10,
  },
});

export default UserProfileView;
