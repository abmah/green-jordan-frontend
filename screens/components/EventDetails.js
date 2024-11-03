import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  I18nManager,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { getEventDetails, joinEvent, leaveEvent } from "../../api";
import Loader from "./Loader";
import useUserIdStore from "../../stores/useUserStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AntDesign } from "@expo/vector-icons";

const EventDetails = ({ route, navigation }) => {
  const { eventId } = route.params;
  const { t, i18n } = useTranslation();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const { userId } = useUserIdStore();

  const isArabic = i18n.language === "ar";
  I18nManager.allowRTL(isArabic);

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
    setActionLoading(true);
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
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveEvent = async () => {
    setActionLoading(true);
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
    } finally {
      setActionLoading(false);
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
      <Text style={styles.eventTitle}>
        {isArabic ? eventDetails.titleAR : eventDetails.title}
      </Text>

      <View style={styles.participantCard}>
        {/* Participant Info */}
        <View style={[styles.participantInfo]}>
          <AntDesign name="user" size={24} color="#FFF" />
          <Text style={styles.participantText}>
            {t("eventDetails.currentParticipants")} {currentParticipantCount}
          </Text>
        </View>
        {/* Additional Details */}
        <View style={styles.separator} />
        <View style={[styles.participantInfo]}>
          <AntDesign name="team" size={24} color="#FFF" />
          <Text style={styles.participantText}>
            {t("eventDetails.maxParticipants")}{" "}
            {eventDetails.requiredParticipants}
          </Text>
        </View>
        <View style={styles.separator} />
        <View style={[styles.participantInfo]}>
          <AntDesign name="calendar" size={24} color="#FFF" />
          <Text style={styles.participantText}>
            {new Date(eventDetails.date).toLocaleString(i18n.language, {
              weekday: "long",
            })}
            ,{" "}
            {new Date(eventDetails.date).toLocaleDateString(i18n.language, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>
      </View>

      <Text style={styles.headerTitle}>{t("eventDetails.aboutEvent")}</Text>
      <Text style={styles.eventDescription}>
        {isArabic ? eventDetails.descriptionAR : eventDetails.description}
      </Text>
      <TouchableOpacity
        style={hasJoined ? styles.leaveButton : styles.joinButton}
        onPress={hasJoined ? handleLeaveEvent : handleJoinEvent}
        disabled={actionLoading}
      >
        {actionLoading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>
            {hasJoined ? t("eventDetails.leave") : t("eventDetails.join")}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0F1F26",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 15,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 28,
    color: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  eventImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  eventTitle: {
    fontSize: 26,
    color: "#FFF",
    marginBottom: 20,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  participantCard: {
    backgroundColor: "#2e4a54",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  participantInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  separator: {
    height: 1,
    backgroundColor: "#4B7078",
    marginVertical: 10,
  },
  participantText: {
    color: "#FFF",
    fontSize: 18,
    marginLeft: 10,
  },
  eventDescription: {
    paddingVertical: 10,
    fontSize: 18,
    color: "#FFF",
    flex: 1,
  },
  joinButton: {
    backgroundColor: "#8AC149",
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: "center",
    // marginTop: 20,
    borderWidth: 1,
    borderColor: "#6B9B38",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  leaveButton: {
    backgroundColor: "#FF5733",
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: "center",
    // marginTop: 20,
    borderWidth: 1,
    borderColor: "#C34A29",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    textTransform: "uppercase",
    textAlign: "center",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default EventDetails;
