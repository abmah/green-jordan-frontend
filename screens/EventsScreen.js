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

  // Fake data for past events
  const pastEventsData = [
    {
      _id: "1",
      title: "Beach Cleanup",
      titleAR: "تنظيف الشاطئ",
      description: "A beach cleanup event that was a great success!",
      descriptionAR: "حدث تنظيف الشاطئ الذي كان ناجحاً للغاية!",
      requiredParticipants: 50,
      conclusion: "Collected over 200 bags of waste. Great teamwork!",
      conclusionAR: "تم جمع أكثر من 200 كيس من النفايات. عمل جماعي رائع!",
      image: "https://example.com/beach-cleanup.jpg",
    },
    {
      _id: "2",
      title: "Tree Planting",
      titleAR: "زرع الأشجار",
      description: "A community effort to plant 100 trees.",
      descriptionAR: "جهد مجتمعي لزرع 100 شجرة.",
      requiredParticipants: 30,
      conclusion: "Successfully planted all 100 trees in the park.",
      conclusionAR: "تمت زراعة جميع الأشجار بنجاح في الحديقة.",
      image: "https://example.com/tree-planting.jpg",
    },
    {
      _id: "3",
      title: "Park Revitalization",
      titleAR: "إعادة تنشيط الحديقة",
      description: "Enhanced the park with new plants and pathways.",
      descriptionAR: "تعزيز الحديقة بنباتات ومسارات جديدة.",
      requiredParticipants: 40,
      conclusion: "Park revitalized and improved for community use.",
      conclusionAR: "تم تجديد الحديقة وتحسينها للاستخدام المجتمعي.",
      image: "https://example.com/park-revitalization.jpg",
    },
    {
      _id: "4",
      title: "River Cleanup",
      titleAR: "تنظيف النهر",
      description: "Cleared trash along the river banks.",
      descriptionAR: "تنظيف ضفاف النهر من القمامة.",
      requiredParticipants: 60,
      conclusion: "Collected over 300 pounds of trash. River is cleaner!",
      conclusionAR: "تم جمع أكثر من 300 رطل من النفايات. النهر أصبح أنظف!",
      image: "https://example.com/river-cleanup.jpg",
    },
    {
      _id: "5",
      title: "Wildflower Planting",
      titleAR: "زراعة الزهور البرية",
      description: "Planted wildflowers to encourage pollinators.",
      descriptionAR: "زراعة الزهور البرية لدعم الملقحات.",
      requiredParticipants: 20,
      conclusion: "Beautiful wildflowers now support pollinators.",
      conclusionAR: "الزهور البرية الجميلة الآن تدعم الملقحات.",
      image: "https://example.com/wildflower-planting.jpg",
    },
    {
      _id: "6",
      title: "Community Garden Build",
      titleAR: "بناء حديقة المجتمع",
      description: "Built a community garden for local residents.",
      descriptionAR: "بناء حديقة مجتمعية للسكان المحليين.",
      requiredParticipants: 25,
      conclusion: "Community garden is ready for planting season!",
      conclusionAR: "حديقة المجتمع جاهزة لموسم الزراعة!",
      image: "https://example.com/community-garden.jpg",
    },
  ];


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

  const renderEventCard = ({ item, isPast }) => (
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
      {isPast && (
        <Text style={styles.eventConclusion}>
          {isArabic ? item.conclusionAR : item.conclusion}
        </Text>
      )}
      <View style={styles.footer}>
        <Text style={styles.maxParticipants}>
          {t("eventScreen.maxMembers")} {item.requiredParticipants}
        </Text>
        <TouchableOpacity
          style={[
            styles.viewDetailsButton,
            isPast && styles.disabledButton,
          ]}
          disabled={isPast}
          onPress={() =>
            !isPast && navigation.navigate("EventDetails", { eventId: item._id })
          }
        >
          <Text style={styles.viewDetailsText}>
            {isPast ? t("eventScreen.pastEvent") : t("eventScreen.viewDetails")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );


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
        renderItem={(props) => renderEventCard({ ...props, isPast: false })}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Upcoming Events</Text>}
        ListFooterComponent={() => (
          <>
            <Text style={styles.sectionTitle}>Past Events</Text>
            <FlatList
              data={pastEventsData}
              renderItem={(props) => renderEventCard({ ...props, isPast: true })}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.listContainer}
            />
          </>
        )}
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
  sectionTitle: {
    fontSize: 22,
    color: "#8AC149",
    fontFamily: "Nunito-ExtraBold",
    marginVertical: 10,
    paddingHorizontal: 20,
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
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
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
    marginBottom: 5,
    fontFamily: "Nunito-Bold",
  },
  eventConclusion: {
    fontSize: 14,
    color: "#B0BEC5",
    fontFamily: "Nunito-Regular",
    marginBottom: 15,
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
  disabledButton: {
    backgroundColor: "gray",
  },
});

export default EventsScreen;
