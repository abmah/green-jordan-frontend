// components/Redeem/RedeemedItems.js

import React from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";

const RedeemedItems = ({ redeemedItems }) => (
  <View style={styles.tabContainer}>
    <Text style={styles.subheader}>Redeemed Items</Text>
    {redeemedItems.length === 0 ? (
      <View style={styles.emptyContainer}>
        <Text style={styles.noItemsText}>No items redeemed yet.</Text>
      </View>
    ) : (
      <FlatList
        data={redeemedItems}
        keyExtractor={(item) => item?._id || Math.random().toString()}
        renderItem={({ item }) =>
          item ? (
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemContent}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemName}>
                  Redeemed for: {item.cost} points
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
    fontSize: 24,
    fontFamily: "Nunito-ExtraBold",
    marginTop: 25,
    marginBottom: 15,
    color: "#fff",
  },
  emptyContainer: {
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#213D49",
    alignItems: "center",
  },
  noItemsText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    color: "white",
  },
  itemContainer: {
    padding: 20,
    marginBottom: 15,
    borderRadius: 18,
    backgroundColor: "#213D49",
    shadowColor: "white",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  itemContent: { flex: 1, marginLeft: 15 },
  itemName: {
    fontSize: 18,
    fontFamily: "Nunito-ExtraBold",
    marginBottom: 10,
    color: "white",
  },
  itemImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default RedeemedItems;
