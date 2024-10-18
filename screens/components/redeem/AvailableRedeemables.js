import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';

const AvailableRedeemables = ({ redeemables, userPoints = 0, onRedeem }) => {
  return (
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
                <Text style={styles.itemCost}>Points Required: {item.cost}</Text>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <TouchableOpacity
                  style={[
                    styles.redeemButton,
                    { backgroundColor: userPoints < item.cost ? '#444' : '#007BFF' }, // Color based on points
                  ]}
                  onPress={() => onRedeem(item)}
                  disabled={userPoints < item.cost}
                >
                  <Text style={styles.redeemButtonText}>Redeem</Text>
                </TouchableOpacity>
              </View>
            ) : null
          )}
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
    textAlign: 'center', // Center align the subheader
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
    shadowColor: "#000", // Shadow for elevation
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2, // For Android
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  itemCost: {
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
  },
  itemImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
    borderRadius: 10,
    resizeMode: 'cover', // Maintain aspect ratio
  },
  redeemButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  redeemButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AvailableRedeemables;
