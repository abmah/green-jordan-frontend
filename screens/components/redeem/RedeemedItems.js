// components/Redeem/RedeemedItems.js

import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

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
        renderItem={({ item }) => (
          item ? (
            <View style={styles.itemContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemName}>Points Required: {item.cost}</Text>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
            </View>
          ) : null
        )}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#0F1F26',

  },
  subheader: {
    fontSize: 22,
    marginTop: 25,
    marginBottom: 15,
    color: '#fff',
  },
  emptyContainer: {
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#213D49",
    alignItems: 'center',
  },
  noItemsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
  itemContainer: {
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#213D49",
    shadowColor: 'white',

  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',

  },
  itemImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default RedeemedItems;
