import React from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";

const AllRedeemables = ({ allRedeemables }) => (
  <View style={styles.tabContainer}>
    <Text style={styles.subheader}>All Redeemables (For Reference)</Text>
    {allRedeemables.length === 0 ? (
      <View style={styles.emptyContainer}>
        <Text style={styles.noItemsText}>No redeemables available.</Text>
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
                  Points Required: {item.cost}
                </Text>
              </View>
            </View>
          ) : null
        }
      />
    )}
  </View>
);

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
