import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRoute } from '@react-navigation/native';
import { getTeamMembers, getTeam } from '../../../api'; // Ensure the getTeam import is correct
import useUserIdStore from '../../../stores/useUserStore';
import TeamPosts from './TeamPosts';
import ManageTeam from './ManageTeam';
import Overview from './Overview';
import CustomTabBar from './CustomTabBar';

const Tab = createBottomTabNavigator();

const TeamDetailsTabs = () => {
  const { userId } = useUserIdStore();
  const route = useRoute();
  const { teamId } = route.params;
  const { isAdmin } = route.params;

  const [teamData, setTeamData] = useState({ name: '', description: '', members: [], joinRequests: [] });
  const [members, setMembers] = useState([]);
  const [isInTeam, setIsInTeam] = useState(false);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const teamResponse = await getTeam(teamId);
        if (teamResponse.data) {
          setTeamData(teamResponse.data);
          setIsInTeam(teamResponse.data.members.includes(userId));
          const membersResponse = await getTeamMembers(teamId);
          if (membersResponse.data) {
            setMembers(membersResponse.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch team data', error);
      }
    };

    fetchTeamData();
  }, [teamId, userId]);




  return (
    <View style={{ flex: 1 }}>
      <View style={styles.teamHeader}>
        <Text style={styles.teamName}>{teamData.name}</Text>
        <Text style={styles.teamDescription}>{teamData.description}</Text>
      </View>
      <Tab.Navigator
        screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen name="Overview" options={{ tabBarLabel: 'Overview' }}>
          {() => <Overview teamData={teamData} members={members} />}
        </Tab.Screen>

        <Tab.Screen name="Posts" options={{ tabBarLabel: 'Team Posts' }}>
          {() => <TeamPosts teamId={teamId} />}
        </Tab.Screen>


        {isAdmin && (
          <Tab.Screen name="Manage" options={{ tabBarLabel: 'Manage Team' }}>
            {() => (
              <ManageTeam
                teamData={teamData}
                teamId={teamId}
                members={members}
                isInTeam={isInTeam}
                setIsInTeam={setIsInTeam}
                setMembers={setMembers}
                setTeamData={setTeamData}
              />
            )}
          </Tab.Screen>
        )}
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  teamHeader: {
    backgroundColor: '#0F1F26',
    padding: 16,
    paddingTop: 50,
  },
  teamName: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  teamDescription: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default TeamDetailsTabs;
