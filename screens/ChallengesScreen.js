import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform
} from 'react-native';
import useUserStore from '../stores/useUserStore';
import ChallengeItem from './components/ChallengeItem';
import { getDailyChallenges } from '../api';
import { useEffect, useState } from 'react';
import Loader from './components/Loader';

const ChallengesScreen = () => {
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const { userId } = useUserStore();
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {

    if (userId) {
      fetchChallenges();
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
    return (
      <Loader />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Daily Challenges</Text>

      {dailyChallenges.length > 0 ? (
        dailyChallenges.map((challenge) => (
          <View key={challenge._id} style={styles.challengeSection}>
            <ChallengeItem challenge={challenge} userId={userId} fetchChallenges={fetchChallenges} />
          </View>
        ))
      ) : (
        <Text style={styles.noChallengesText}>No daily challenges available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0F1F26',
    paddingTop: Platform.OS === 'android' ? 50 : 0,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  loginPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F1F26',
  },
  loginPrompt: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',

  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
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
});

export default ChallengesScreen;
