// components/Redeem/AllRedeemables.js

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
                <Text style={styles.itemName}>
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
    fontSize: 24,
    marginTop: 25,
    marginBottom: 15,
    color: "#fff",
  },
  emptyContainer: {
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  noItemsText: {
    fontSize: 16,
    fontFamily: "Nunito-Medium",
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
  itemContent: { marginLeft: 15, flex: 1 },
  itemName: {
    fontSize: 20,
    fontFamily: "Nunito-ExtraBold",
    marginBottom: 10,
    color: "white",
  },
  itemImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#213D49",
  },
});

export default AllRedeemables;
