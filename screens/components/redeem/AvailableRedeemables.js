import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

const AvailableRedeemables = ({ redeemables, userPoints = 0, onRedeem }) => {
  const [loading, setLoading] = useState({});

  const handleRedeem = async (item) => {
    if (loading[item._id]) return; // Prevent multiple requests for the same item
    setLoading((prev) => ({ ...prev, [item._id]: true }));

    try {
      await onRedeem(item); // Call the redeem function
    } catch (error) {
      console.error("Error redeeming item:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [item._id]: false }));
    }
  };

  return (
    <View style={styles.tabContainer}>
      <Text style={styles.points}>Points: {userPoints}</Text>
      <Text style={styles.subheader}>Available</Text>
      {redeemables.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.noItemsText}>
            No items available for redemption.
          </Text>
        </View>
      ) : (
        <FlatList
          data={redeemables}
          keyExtractor={(item) => item?._id || Math.random().toString()}
          renderItem={({ item }) =>
            item ? (
              <View style={styles.itemContainer}>
                <View style={styles.itemContent}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                  />

                  <View style={styles.textContainer}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCost}>{item.description}</Text>
                  </View>
                </View>
                <View style={styles.redeemButtonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.redeemButton,
                      {
                        backgroundColor:
                          userPoints < item.cost || loading[item._id]
                            ? "#444"
                            : "#8AC149",
                      },
                    ]}
                    onPress={() => handleRedeem(item)}
                    disabled={userPoints < item.cost || loading[item._id]}
                  >
                    <Text style={styles.redeemButtonText}>
                      {loading[item._id]
                        ? "Processing..."
                        : `GET FOR ${item.cost}`}
                    </Text>
                  </TouchableOpacity>
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
  points: {
    paddingVertical: 10,
    fontSize: 24,
    fontFamily: "Nunito-Regular",
    marginBottom: 25,
    color: "#fff",
    textAlign: "left",
  },
  subheader: {
    fontSize: 30,
    fontFamily: "Nunito-ExtraBold",
    marginTop: 25,
    marginBottom: 15,
    color: "white",
    textAlign: "center",
  },
  emptyContainer: {
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#213D49",
    alignItems: "center",
    borderRadius: 18,
  },
  noItemsText: {
    color: "white",
    fontFamily: "Nunito-Medium",
    fontSize: 16,
    textAlign: "center",
  },
  itemContainer: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 18,
    backgroundColor: "#213D49",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 20,
    fontFamily: "Nunito-ExtraBold",
    marginBottom: 5,
    color: "white",
  },
  itemCost: {
    fontSize: 16,
    fontFamily: "Nunito-Bold",
    color: "white",
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    resizeMode: "cover",
  },
  redeemButtonContainer: { alignItems: "flex-end" },
  redeemButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 160,
  },
  redeemButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Nunito-ExtraBold",
  },
});

export default AvailableRedeemables;
