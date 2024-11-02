import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  I18nManager,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { getAllEvents } from "../api";
import Loader from "./components/Loader";

const EventsScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const isArabic = i18n.language === "ar";
  I18nManager.allowRTL(isArabic);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEventsData(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
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
            style={[
              styles.eventImage,
              isArabic ? styles.imageLeft : styles.imageRight,
            ]}
            resizeMode="cover"
          />
        )}
        <Text style={styles.eventTitle}>
          {isArabic ? item.titleAR : item.title}
        </Text>
        <Text style={styles.eventDescription}>
          {isArabic ? item.descriptionAR : item.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.maxParticipants}>
            {t("eventScreen.maxMembers")} {item.requiredParticipants}
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
    paddingTop: 40,
    gap: 20,
    paddingHorizontal: 20,
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
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    height: 200,
    overflow: "hidden",
    flexDirection: "column",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    backgroundColor: "#183d4d",
  },
  eventImage: {
    position: "absolute",
    top: 0,
    height: 220,
    width: 220,
    opacity: 0.5,
    borderRadius: 10,
  },
  imageLeft: {
    left: 0,
  },
  imageRight: {
    right: 0,
  },
  eventTitle: {
    fontSize: 24,
    fontFamily: "Nunito-ExtraBold",
    color: "#FFF",
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 15,
    fontFamily: "Nunito-Bold",
    marginTop: 0,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "auto",
    justifyContent: "space-between",
  },
  maxParticipants: {
    fontSize: 16,
    color: "#FFF",
    fontFamily: "Nunito-Bold",
  },
  viewDetailsButton: {
    backgroundColor: "#8AC149",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  viewDetailsText: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "Nunito-Black",
  },
});

export default EventsScreen;
