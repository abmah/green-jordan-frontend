import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
} from "react-native";

const AvailableRedeemables = ({ redeemables, userPoints = 0, onRedeem }) => {
  const [loading, setLoading] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleRedeem = async (item) => {
    if (loading[item._id]) return; // Prevent multiple requests for the same item
    setLoading((prev) => ({ ...prev, [item._id]: true }));

    try {
      await onRedeem(item); // Call the redeem function

    } catch (error) {
      console.error("Error redeeming item:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [item._id]: false }));
      setModalVisible(false); // Close the modal
    }
  };

  const openConfirmationModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.tabContainer}>
      <Text style={styles.points}>Points: {userPoints}</Text>
      <Text style={styles.subheader}>Available Redeemables</Text>

      {redeemables.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.noItemsText}>No items available for redemption.</Text>
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
                    onPress={() => openConfirmationModal(item)}
                    disabled={userPoints < item.cost || loading[item._id]}
                  >
                    <Text style={styles.redeemButtonText}>
                      {loading[item._id]
                        ? "Processing..."
                        : `Get for ${item.cost}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null
          }
        />
      )}

      {/* Modal for Confirmation */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Redemption</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to redeem{" "}
              <Text style={styles.itemName}>{selectedItem?.name}</Text> for{" "}
              {selectedItem?.cost} points?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={closeModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleRedeem(selectedItem)}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 30,
    fontFamily: "Nunito-Bold",
    marginBottom: 25,
    color: "#FF9804",
    textAlign: "left",
  },
  subheader: {
    fontSize: 22,
    fontFamily: "Nunito-ExtraBold",
    marginBottom: 15,
    color: "#fff",
    // textAlign: "center",
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
    fontFamily: "Nunito-Medium",
    color: "#fff",
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
    color: "#fff",
  },
  itemCost: {
    fontSize: 16,
    fontFamily: "Nunito-Bold",
    color: "#fff",
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    resizeMode: "cover",
  },
  redeemButtonContainer: {
    alignItems: "flex-end",
  },
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
    color: "#fff",
    fontSize: 16,
    fontFamily: "Nunito-ExtraBold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Nunito-ExtraBold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: "Nunito-Regular",
    textAlign: "center",
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#8AC149",
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Nunito-Bold",
  },
});

export default AvailableRedeemables;
