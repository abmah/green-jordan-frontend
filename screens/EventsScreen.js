import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  FlatList,
  Animated,
  Easing,
  TouchableOpacity,
  Image,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { getAllEvents, joinEvent, leaveEvent } from "../api"; // Import your API call functions
import useUserIdStore from "../stores/useUserStore";
import Toast from 'react-native-toast-message'; // Import Toast

const EventsScreen = ({ navigation }) => {
  const { userId } = useUserIdStore();
  const { t } = useTranslation();
  const [eventsData, setEventsData] = useState([]);
  const [attendingEvents, setAttendingEvents] = useState({});
  const [buttonAnimations, setButtonAnimations] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEventsData(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleAttend = async (eventId) => {
    const isAttending = attendingEvents[eventId];
    const action = isAttending ? 'leave' : 'join'; // Determine action
    const confirmationMessage = isAttending
      ? t("eventScreen.confirmLeave")
      : t("eventScreen.confirmJoin");

    Alert.alert(
      confirmationMessage,
      t("eventScreen.areYouWilling"),
      [
        {
          text: t("eventScreen.cancel"),
          style: "cancel",
        },
        {
          text: t("eventScreen.yes"),
          onPress: async () => {
            try {
              if (isAttending) {
                await leaveEvent(eventId, userId);
                setAttendingEvents((prevState) => ({
                  ...prevState,
                  [eventId]: false,
                }));
                Toast.show({
                  text1: t("eventScreen.leaveSuccess"), // Customize your toast message
                  type: 'success',
                });
              } else {
                await joinEvent(eventId, userId);
                setAttendingEvents((prevState) => ({
                  ...prevState,
                  [eventId]: true,
                }));
                Toast.show({
                  text1: t("eventScreen.joinSuccess"), // Customize your toast message
                  type: 'success',
                });
              }
            } catch (error) {
              Toast.show({
                text1: t("eventScreen.error"),
                text2: error.message,
                type: 'error',
              });
            }
          },
        },
      ]
    );
  };

  const handlePressIn = (eventId) => {
    if (!buttonAnimations[eventId]) {
      buttonAnimations[eventId] = new Animated.Value(1);
      setButtonAnimations({ ...buttonAnimations });
    }
    Animated.timing(buttonAnimations[eventId], {
      toValue: 0.95,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (eventId) => {
    Animated.timing(buttonAnimations[eventId], {
      toValue: 1,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      handleAttend(eventId);
    });
  };

  const renderEventCard = ({ item }) => {
    const buttonBackgroundColor = attendingEvents[item._id]
      ? "#21603F"
      : "#8AC149";

    return (
      <View style={styles.eventCard}>
        {item.image && (
          <Image
            source={{ uri: item.image }}
            style={styles.eventImage}
            resizeMode="cover"
          />
        )}
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDescription}>{item.description}</Text>
        <Text style={styles.maxParticipants}>
          Max Participants: {item.requiredParticipants}
        </Text>
        <View style={styles.attendButtonContainer}>
          {!attendingEvents[item._id] && (
            <View style={styles.attendButtonUnderline} />
          )}
          <Animated.View
            style={[
              styles.attendButton,
              {
                backgroundColor: buttonBackgroundColor,
                transform: [{ scale: buttonAnimations[item._id] || 1 }],
              },
            ]}
          >
            <Pressable
              onPressIn={() => handlePressIn(item._id)}
              onPressOut={() => handlePressOut(item._id)}
              disabled={attendingEvents[item._id]}
            >
              <Text style={styles.attendText}>
                {attendingEvents[item._id]
                  ? t("eventScreen.attending")
                  : t("eventScreen.attend")}
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("eventScreen.header")}</Text>
      </View>
      <FlatList
        data={eventsData}
        renderItem={renderEventCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />

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
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  eventCard: {
    backgroundColor: "#1E2D3A",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  eventImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 24,
    fontFamily: "Nunito-ExtraBold",
    color: "#FFF",
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 16,
    fontFamily: "Nunito-SemiBold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  maxParticipants: {
    fontSize: 14,
    fontFamily: "Nunito-Regular",
    color: "#FFF",
    marginBottom: 5,
  },
  attendButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
  attendButtonUnderline: {
    width: "100%",
    maxWidth: 150,
    height: 45,
    backgroundColor: "#3E600F",
    borderRadius: 75,
    position: "absolute",
    top: 4,
  },
  attendButton: {
    width: "100%",
    maxWidth: 150,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 75,
  },
  attendText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Nunito-ExtraBold",
    textTransform: "uppercase",
  },
});

export default EventsScreen;
