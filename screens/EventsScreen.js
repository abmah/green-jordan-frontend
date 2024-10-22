import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator, // Import ActivityIndicator for loading state
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { getAllEvents } from "../api";
import Loader from "./components/Loader";

const EventsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEventsData(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        // Optionally show an alert or message to the user about the error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchEvents();
  }, []);

  const renderEventCard = ({ item }) => {
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
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={() =>
            navigation.navigate("EventDetails", { eventId: item._id })
          }
        >
          <Text style={styles.viewDetailsText}>
            {t("eventScreen.viewDetails")}
          </Text>
        </TouchableOpacity>
      </View>
    );
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
    marginBottom: 10,
  },
  viewDetailsButton: {
    backgroundColor: "#8AC149",
    borderRadius: 75,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  viewDetailsText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Nunito-ExtraBold",
    textTransform: "uppercase",
  },
});

export default EventsScreen;
