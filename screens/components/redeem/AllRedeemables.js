import React from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next"; // Import the translation hook

const AllRedeemables = ({ allRedeemables }) => {
  const { t } = useTranslation(); // Hook to access translation function

  return (
    <View style={styles.tabContainer}>
      <Text style={styles.subheader}>
        {t("allRedeemables.header", {
          context: "All Redeemables (For Reference)",
        })}
      </Text>
      {allRedeemables.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.noItemsText}>
            {t("allRedeemables.noItemsText", {
              context: "No redeemables available.",
            })}
          </Text>
        </View>
      ) : (
        <FlatList
          data={allRedeemables}
          keyExtractor={(item) => item?._id || Math.random().toString()}
          renderItem={({ item }) =>
            item ? (
              <View style={styles.itemContainer}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDescription}>
                    {t("allRedeemables.pointsRequired")} {item.cost}
                  </Text>
                </View>
              </View>
            ) : null
          }
        />
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
    alignItems: "center",
    backgroundColor: "#213D49",
  },
  noItemsText: {
    fontSize: 16,
    fontFamily: "Nunito-Regular",
    textAlign: "center",
    color: "#FFFFFF",
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
    color: "#FFFFFF",
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
});

export default AllRedeemables;
