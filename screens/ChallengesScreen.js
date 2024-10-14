import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useUserStore from '../stores/useUserStore';
import ChallengeItem from './components/ChallengeItem';
import { getDailyChallenges } from '../api';
import Loader from './components/Loader';
import { getSelf } from '../api/self';

const ChallengesScreen = ({ navigation }) => {
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const { userId } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const { dailyChallenges } = await getDailyChallenges(userId);
      setDailyChallenges(dailyChallenges);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
      setDailyChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await getSelf();
      setUserData(response.user);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setUserData(null);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchChallenges();
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [userId]);

  if (!userId) {
    return (
      <View style={styles.loginPromptContainer}>
        <Text style={styles.loginPrompt}>Please login first</Text>
      </View>
    );
  }

  if (loading) {
    return <Loader />;
  }

  const renderHeader = () => (
    <>
      {userData && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.streakText}>Current Streak: {userData.streak}</Text>
          <Text style={styles.pointsText}>Total Points: {userData.points}</Text>
          <Text style={styles.lastChallengeText}>
            Last Challenge Completed: {new Date(userData.lastChallengeCompleted).toLocaleDateString()}
          </Text>
          <Text style={styles.challengesAssignedText}>
            Challenges Assigned Today: {userData.dailyChallengesAssigned.length}
          </Text>
        </View>
      )}
    </>
  );

  const renderItem = ({ item }) => (
    <View style={styles.challengeSection}>
      <ChallengeItem
        navigation={navigation}
        challenge={item}
        userId={userId}
        fetchChallenges={fetchChallenges}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate('Teams')}
      >
        <Ionicons name="people-outline" size={24} color="white" />
        <Text style={styles.iconText}>Teams</Text>
      </TouchableOpacity>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={dailyChallenges}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<Text style={styles.noChallengesText}>No daily challenges available.</Text>}
        stickyHeaderIndices={[0]}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0F1F26',
    paddingTop: Platform.OS === 'android' ? 50 : 0,
  },
  userInfoContainer: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#202F36', // Added background color for better contrast
  },
  streakText: {
    fontSize: 18,
    fontFamily: 'Nunito-ExtraBold',
    marginBottom: 5,
    color: '#FFD700',
  },
  pointsText: {
    fontSize: 18,
    fontFamily: 'Nunito-ExtraBold',
    marginBottom: 5,
    color: '#66FF66',
  },
  lastChallengeText: {
    fontSize: 18,
    fontFamily: 'Nunito-ExtraBold',
    marginBottom: 5,
    color: '#FFFFFF',
  },
  challengesAssignedText: {
    fontSize: 18,
    fontFamily: 'Nunito-ExtraBold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  loginPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F1F26',
  },
  loginPrompt: {
    fontSize: 20,
    fontFamily: 'Nunito-ExtraBold',
    color: '#fff',
    textAlign: 'center',
  },
  challengeSection: {
    marginBottom: 20,
  },
  noChallengesText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  iconContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#0F9AFE',
  },
  iconText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ChallengesScreen;
