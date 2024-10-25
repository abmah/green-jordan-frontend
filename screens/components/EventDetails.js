import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { getEventDetails, joinEvent, leaveEvent } from "../../api";
import Loader from "./Loader";
import useUserIdStore from "../../stores/useUserStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const EventDetails = ({ route, navigation }) => {
  const { eventId } = route.params;
  const { t } = useTranslation();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const { userId } = useUserIdStore();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const data = await getEventDetails(eventId);
        setEventDetails(data);
        setHasJoined(
          data.participants.some((participant) => participant._id === userId)
        );
      } catch (error) {
        console.error("Error fetching event details:", error);
        Toast.show({
          type: "error",
          text1: t("eventDetails.fetchError"),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, t, userId]);

  const handleJoinEvent = async () => {
    try {
      await joinEvent(eventId, userId);
      setHasJoined(true);
      setEventDetails((prevDetails) => ({
        ...prevDetails,
        participants: [...prevDetails.participants, { _id: userId }],
      }));
      Toast.show({
        type: "success",
        text1: t("eventDetails.joinSuccess"),
      });
    } catch (error) {
      console.error("Error joining event:", error);
      Toast.show({
        type: "error",
        text1: t("eventDetails.joinError"),
      });
    }
  };

  const handleLeaveEvent = async () => {
    try {
      await leaveEvent(eventId, userId);
      setHasJoined(false);
      setEventDetails((prevDetails) => ({
        ...prevDetails,
        participants: prevDetails.participants.filter(
          (participant) => participant._id !== userId
        ),
      }));
      Toast.show({
        type: "success",
        text1: t("eventDetails.leaveSuccess"),
      });
    } catch (error) {
      console.error("Error leaving event:", error);
      Toast.show({
        type: "error",
        text1: t("eventDetails.leaveError"),
      });
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!eventDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t("eventDetails.noData")}</Text>
      </View>
    );
  }

  const currentParticipantCount = eventDetails.participants.length;

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("eventDetails.header")}</Text>
      </View>

      <Image source={{ uri: eventDetails.image }} style={styles.eventImage} />
      <Text style={styles.eventTitle}>{eventDetails.title}</Text>
      <Text style={styles.eventDescription}>{eventDetails.description}</Text>
      <Text style={styles.participantCount}>
        Max Participants: {eventDetails.requiredParticipants}
      </Text>
      <Text style={styles.participantCount}>
        Current Participants: {currentParticipantCount}
      </Text>
      <TouchableOpacity
        style={hasJoined ? styles.leaveButton : styles.joinButton}
        onPress={hasJoined ? handleLeaveEvent : handleJoinEvent}
      >
        <Text style={styles.buttonText}>
          {hasJoined ? t("eventDetails.leave") : t("eventDetails.join")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#001c2c",

  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    gap: 20,
    // paddingHorizontal: 20,
  },
  backButton: {
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Nunito-ExtraBold",
    color: "#FFF",
  },
  eventImage: {
    objectFit: "contain",
    height: 300,
    borderRadius: 12,
  },
  eventTitle: {
    fontSize: 24,
    fontFamily: "Nunito-ExtraBold",
    color: "#FFF",
    marginVertical: 10,
  },
  eventDescription: {
    fontSize: 16,
    fontFamily: "Nunito-Bold",
    color: "#FFF",
    marginBottom: 40,
  },
  participantCount: {
    fontSize: 20,
    fontFamily: "Nunito-Bold",
    color: "#FFF",
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: "#8AC149",
    borderRadius: 75,
    paddingVertical: 10,
    alignItems: "center",
  },
  leaveButton: {
    backgroundColor: "#FF5733",
    borderRadius: 75,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Nunito-ExtraBold",
    textTransform: "uppercase",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 16,
    textAlign: "center",
  },
});

export default EventDetails;
