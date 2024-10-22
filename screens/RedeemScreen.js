import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
  getAllAvailableRedeemables,
  getAllRedeemables,
  redeemItem,
  getBasket,
} from "../api";
import useUserStore from "../stores/useUserStore";
import CustomTabBar from "./components/teams/CustomTabBar";
import AvailableRedeemables from "./components/redeem/AvailableRedeemables";
import AllRedeemables from "./components/redeem/AllRedeemables";
import RedeemedItems from "./components/redeem/RedeemedItems";
import Loader from "./components/Loader"; // Import your custom Loader component
import MaterialIcons from "@expo/vector-icons/MaterialIcons"; // Import Material Icons
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next"; // Import the translation hook

const Tab = createBottomTabNavigator();

const RedeemScreen = ({ navigation }) => {
  const { userId } = useUserStore.getState();
  const { t } = useTranslation(); // Hook to access translation function
  const [userPoints, setUserPoints] = useState(0);
  const [redeemables, setRedeemables] = useState([]);
  const [allRedeemables, setAllRedeemables] = useState([]);
  const [redeemedItems, setRedeemedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const availableResponse = await getAllAvailableRedeemables(userId);
        if (availableResponse && availableResponse.data) {
          setUserPoints(availableResponse.data.points || 0);
          setRedeemables(availableResponse.data.availableRedeemables || []);
        }

        const allRedeemablesResponse = await getAllRedeemables();
        const availableRedeemables = allRedeemablesResponse.redeemables || [];
        setAllRedeemables(availableRedeemables);

        const basketResponse = await getBasket(userId);
        if (basketResponse && basketResponse.redeemedItems) {
          const redeemedIds = basketResponse.redeemedItems
            .map((item) => item.redeemableId)
            .filter((id) => id != null);
          setRedeemedItems(redeemedIds);
        }
      } catch (error) {
        Alert.alert(
          t("redeemScreen.errorTitle"),
          t("redeemScreen.errorMessage")
        );
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleRedeem = async (item) => {
    if (!item || userPoints < item.cost) {
      Alert.alert(
        t("redeemScreen.insufficientPointsTitle"),
        t("redeemScreen.insufficientPointsMessage")
      );
      return;
    }

    try {
      const response = await redeemItem(userId, item._id);
      if (response) {
        Alert.alert(
          t("redeemScreen.successTitle"),
          t("redeemScreen.successMessage")
        );
        setUserPoints(response.remainingPoints || 0);
        const updatedRedeemables = redeemables.filter(
          (redeemable) => redeemable._id !== item._id
        );
        setRedeemables(updatedRedeemables);
        setRedeemedItems([...redeemedItems, item]);
        queryClient.refetchQueries(["profile"]);
      } else {
        Alert.alert(t("redeemScreen.errorTitle"), t("redeemScreen.noResponse"));
      }
    } catch (error) {
      Alert.alert(
        t("redeemScreen.errorTitle"),
        t("redeemScreen.errorRedeeming")
      );
      console.error("Error redeeming item:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("redeemScreen.header")}</Text>
      </View>
      <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
        <Tab.Screen
          name="Available"
          options={{
            tabBarLabel: t("redeemScreen.available"),
            headerShown: false,
          }}
        >
          {() => (
            <AvailableRedeemables
              redeemables={redeemables}
              userPoints={userPoints}
              onRedeem={handleRedeem}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="All"
          options={{
            tabBarLabel: t("redeemScreen.redeemables"),
            headerShown: false,
          }}
        >
          {() => <AllRedeemables allRedeemables={allRedeemables} />}
        </Tab.Screen>
        <Tab.Screen
          name="Redeemed"
          options={{
            tabBarLabel: t("redeemScreen.redeemed"),
            headerShown: false,
          }}
        >
          {() => <RedeemedItems redeemedItems={redeemedItems} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001c2c",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Nunito-ExtraBold",
    color: "#FFF",
  },
});

export default RedeemScreen;
