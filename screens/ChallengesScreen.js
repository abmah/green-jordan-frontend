import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image
} from 'react-native';
import useUserStore from '../stores/useUserStore';
import ChallengeItem from './components/ChallengeItem';
import { getAllChallenges } from '../api/challenge';
import { useEffect, useState } from 'react';

const ChallengesScreen = () => {
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [freeChallenges, setFreeChallenges] = useState([]);
  const { userId } = useUserStore();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const { dailyChallenge, freeChallenges } = await getAllChallenges();
        setDailyChallenge(dailyChallenge);
        setFreeChallenges(freeChallenges);
      } catch (error) {
        console.error('Failed to fetch challenges:', error);
      }
    };

    fetchChallenges();
  }, []);

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={styles.loginPrompt}>Please login first</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Available Challenges</Text>

      {dailyChallenge && (
        <View style={styles.challengeSection}>
          <Text style={styles.sectionTitle}>Daily Challenge</Text>
          <ChallengeItem
            key={dailyChallenge._id}
            challenge={dailyChallenge}
            userId={userId}
          />
        </View>
      )}

      <View style={styles.challengeSection}>
        <Text style={styles.sectionTitle}>Free Challenges</Text>
        {freeChallenges.map((challenge) => (
          <ChallengeItem
            key={challenge._id}
            challenge={challenge}
            userId={userId}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  loginPrompt: {
    fontSize: 18,
    color: '#ff4d4d',
  },
  challengeSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
});

export default ChallengesScreen;
