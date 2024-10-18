import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { getAllAvailableRedeemables, getAllRedeemables, redeemItem, getBasket } from '../api';
import useUserStore from '../stores/useUserStore';
import CustomTabBar from './components/teams/CustomTabBar';
import AvailableRedeemables from './components/redeem/AvailableRedeemables';
import AllRedeemables from './components/redeem/AllRedeemables';
import RedeemedItems from './components/redeem/RedeemedItems';

const Tab = createBottomTabNavigator();

const RedeemScreen = () => {
  const { userId } = useUserStore.getState();
  const [userPoints, setUserPoints] = useState(0);
  const [redeemables, setRedeemables] = useState([]); // Should hold redeemable items
  const [allRedeemables, setAllRedeemables] = useState([]);
  const [redeemedItems, setRedeemedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const availableResponse = await getAllAvailableRedeemables(userId);
        if (availableResponse && availableResponse.data) {
          // Correctly set redeemables from availableResponse
          setUserPoints(availableResponse.data.points || 0);
          setRedeemables(availableResponse.data.availableRedeemables || []); // Use this line
        }

        const allRedeemablesResponse = await getAllRedeemables();
        const availableRedeemables = allRedeemablesResponse.redeemables || [];
        setAllRedeemables(availableRedeemables);

        const basketResponse = await getBasket(userId);
        if (basketResponse && basketResponse.redeemedItems) {
          const redeemedIds = basketResponse.redeemedItems.map(item => item.redeemableId).filter(id => id != null);
          setRedeemedItems(redeemedIds);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load data.');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleRedeem = async (item) => {
    if (!item || userPoints < item.cost) {
      Alert.alert('Insufficient Points', 'You do not have enough points to redeem this item.');
      return;
    }

    try {
      const response = await redeemItem(userId, item._id);
      if (response) {
        Alert.alert('Success', response.message);
        setUserPoints(response.remainingPoints || 0);
        const updatedRedeemables = redeemables.filter((redeemable) => redeemable._id !== item._id);
        setRedeemables(updatedRedeemables);
        setRedeemedItems([...redeemedItems, item]);
      } else {
        Alert.alert('Error', 'No response from server.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to redeem item.');
      console.error('Error redeeming item:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  console.log('User Points:', userPoints); // Debugging output
  console.log('Redeemables:', redeemables); // Debugging output

  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen name="Available" options={{ tabBarLabel: 'Available', headerShown: false }}>
        {() => (
          <AvailableRedeemables
            redeemables={redeemables}
            userPoints={userPoints}
            onRedeem={handleRedeem}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="All" options={{ tabBarLabel: 'Redeemables', headerShown: false }}>
        {() => <AllRedeemables allRedeemables={allRedeemables} />}
      </Tab.Screen>
      <Tab.Screen name="Redeemed" options={{ tabBarLabel: 'Redeemed', headerShown: false }}>
        {() => <RedeemedItems redeemedItems={redeemedItems} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#0F1F26',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default RedeemScreen;
