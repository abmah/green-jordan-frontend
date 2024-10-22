import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { getEventDetails, joinEvent, leaveEvent } from "../../api";
import Loader from "./Loader";
import useUserIdStore from "../../stores/useUserStore";
import Icon from "react-native-vector-icons/Ionicons";

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
        Alert.alert(t("error"), t("eventDetails.fetchError"));
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
      Alert.alert(t("success"), t("eventDetails.joinSuccess"));
    } catch (error) {
      console.error("Error joining event:", error);
      Alert.alert(t("error"), t("eventDetails.joinError"));
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
      Alert.alert(t("success"), t("eventDetails.leaveSuccess"));
    } catch (error) {
      console.error("Error leaving event:", error);
      Alert.alert(t("error"), t("eventDetails.leaveError"));
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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={30} color="#FFF" />
      </TouchableOpacity>

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
          {hasJoined ? t("leave") : t("join")}
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
    paddingVertical: 40,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
    paddingVertical: 10,
  },
  eventImage: {
    width: "100%",
    height: 200,
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
    fontFamily: "Nunito-Regular",
    color: "#FFF",
    marginBottom: 10,
  },
  participantCount: {
    fontSize: 14,
    fontFamily: "Nunito-Regular",
    color: "#FFF",
    marginBottom: 20,
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
