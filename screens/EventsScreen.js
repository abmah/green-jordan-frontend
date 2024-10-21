import React, { useState } from "react";
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
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
const eventsData = [
  {
    id: "1",
    title: "Beach Cleanup",
    description: "Join us in cleaning up the local beach.",
    maxParticipants: 50,
    points: 10,
  },
  {
    id: "2",
    title: "Tree Planting",
    description: "Help plant trees in the community park.",
    maxParticipants: 30,
    points: 15,
  },
  {
    id: "3",
    title: "Local Mosque Cleanup",
    description: "Help clean and maintain the local mosque.",
    maxParticipants: 20,
    points: 12,
  },
  {
    id: "4",
    title: "Food Distribution",
    description: "Help distribute food to the needy.",
    maxParticipants: 25,
    points: 20,
  },
];

const EventsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [attendingEvents, setAttendingEvents] = useState({});
  const [buttonAnimations, setButtonAnimations] = useState({});
  const handleAttend = (eventId) => {
    Alert.alert(
      t("eventScreen.confirmAttendance"),
      t("eventScreen.areYouWilling"),
      [
        {
          text: t("eventScreen.cancel"),
          style: "cancel",
        },
        {
          text: t("eventScreen.yes"),
          onPress: () => {
            setAttendingEvents((prevState) => ({
              ...prevState,
              [eventId]: true,
            }));
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
    const buttonBackgroundColor = attendingEvents[item.id]
      ? "#21603F"
      : "#8AC149";
    return (
      <View style={styles.eventCard}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDescription}>{item.description}</Text>
        <Text style={styles.maxParticipants}>
          Max Participants: {item.maxParticipants}
        </Text>
        <Text style={styles.points}>Points: {item.points}</Text>
        <View style={styles.attendButtonContainer}>
          {!attendingEvents[item.id] && (
            <View style={styles.attendButtonUnderline} />
          )}
          <Animated.View
            style={[
              styles.attendButton,
              {
                backgroundColor: buttonBackgroundColor,
                transform: [{ scale: buttonAnimations[item.id] || 1 }],
              },
            ]}
          >
            <Pressable
              onPressIn={() => handlePressIn(item.id)}
              onPressOut={() => handlePressOut(item.id)}
              disabled={attendingEvents[item.id]}
            >
              <Text style={styles.attendText}>
                {attendingEvents[item.id]
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
        keyExtractor={(item) => item.id}
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
  points: {
    fontSize: 14,
    fontFamily: "Nunito-Regular",
    color: "#FFF",
    marginBottom: 15,
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
