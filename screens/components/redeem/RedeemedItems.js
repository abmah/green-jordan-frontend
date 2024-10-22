import React from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next"; // Import the translation hook

const RedeemedItems = ({ redeemedItems }) => {
  const { t } = useTranslation(); // Hook to access translation function

  return (
    <View style={styles.tabContainer}>
      <Text style={styles.subheader}>{t("redeemedItems.header")}</Text>
      {redeemedItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.noItemsText}>
            {t("redeemedItems.noItemsText")}
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={redeemedItems}
            keyExtractor={(item) => item?._id || Math.random().toString()}
            renderItem={({ item }) =>
              item ? (
                <View style={styles.itemContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemContent}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDescription}>
                      {t("redeemedItems.redeemedFor")} {item.cost}
                    </Text>
                  </View>
                </View>
              ) : null
            }
          />
          <View style={styles.processingContainer}>
            <Text style={styles.processingText}>
              {t("redeemedItems.processingMessage")}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#0F1F26",
  },
  subheader: {
    fontSize: 22,
    fontFamily: "Nunito-ExtraBold",
    marginBottom: 20,
    color: "#FFFFFF",
  },
  emptyContainer: {
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#213D49",
    alignItems: "center",
  },
  noItemsText: {
    fontSize: 16,
    fontFamily: "Nunito-Regular",
    textAlign: "center",
    color: "white",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 20,
    marginBottom: 15,
    borderRadius: 18,
    backgroundColor: "#213D49",
  },
  itemContent: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 18,
    fontFamily: "Nunito-ExtraBold",
    marginBottom: 5,
    color: "white",
  },
  itemDescription: {
    fontSize: 16,
    fontFamily: "Nunito-Regular",
    color: "#FFFFFF",
  },
  itemImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
  processingContainer: {
    padding: 20,
    backgroundColor: "#213D49",
    borderRadius: 10,
    marginTop: 15,
  },
  processingText: {
    fontSize: 16,
    fontFamily: "Nunito-Regular",
    textAlign: "center",
    color: "#FFFFFF",
  },
});

export default RedeemedItems;
