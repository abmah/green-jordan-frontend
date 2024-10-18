// components/Redeem/AvailableRedeemables.js

import React from 'react';
import { View, Text, FlatList, Button, Image, StyleSheet } from 'react-native';

const AvailableRedeemables = ({ redeemables, userPoints, onRedeem }) => (
  <View style={styles.tabContainer}>
    <Text style={styles.points}>Your Points: {userPoints}</Text>
    <Text style={styles.subheader}>Available</Text>
    {redeemables.length === 0 ? (
      <View style={styles.emptyContainer}>
        <Text style={styles.noItemsText}>No items available for redemption.</Text>
      </View>
    ) : (
      <FlatList
        data={redeemables}
        keyExtractor={(item) => item?._id || Math.random().toString()}
        renderItem={({ item }) => (
          item ? (
            <View style={styles.itemContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemName}>Points Required: {item.cost}</Text>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <Button
                title="Redeem"
                onPress={() => onRedeem(item)}
                disabled={userPoints < item.cost}
              />
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
  points: {
    fontSize: 18,
    marginBottom: 25,
    color: '#fff',
    textAlign: 'center',
  },
  subheader: {
    fontSize: 22,
    marginTop: 25,
    marginBottom: 15,
    color: 'white',
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
  },
  itemContainer: {
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#213D49",

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

export default AvailableRedeemables;
