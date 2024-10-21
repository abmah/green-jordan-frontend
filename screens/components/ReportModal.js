import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Ensure you have this installed

const ReportModal = ({ visible, onClose, onReport }) => {
  const reasons = [
    "Spam or misleading",
    "Hateful content",
    "Graphics content",
    "Other",
  ];

  const [selectedReason, setSelectedReason] = useState(null);

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
  };

  const handleConfirmReport = () => {
    if (selectedReason) {
      onReport(selectedReason);
      setSelectedReason(null); // Reset selection
      onClose(); // Close the modal
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Report User</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.reasonsContainer}>
            {reasons.map((reason, index) => (
              <View key={index} style={styles.reasonContainer}>
                <TouchableOpacity
                  style={styles.reasonButton}
                  onPress={() => handleReasonSelect(reason)}
                >
                  <Text style={styles.reasonText}>{reason}</Text>
                </TouchableOpacity>
                {index < reasons.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            ))}
          </View>

          {selectedReason && (
            <View style={styles.confirmationContainer}>
              <Text style={styles.confirmationText}>
                You are reporting for:{" "}
                <Text style={styles.reasonBold}>{selectedReason}</Text>
              </Text>
              <Pressable
                style={styles.confirmButton}
                onPress={handleConfirmReport}
              >
                <Text style={styles.confirmText}>Confirm Report</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#37464F",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    alignItems: "center",
    minHeight: "80%",
    maxHeight: "80%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  header: {
    fontFamily: "Nunito-ExtraBold",
    fontSize: 24,
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    paddingRight: 10,
  },
  reasonsContainer: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  reasonContainer: {
    width: "100%",
  },
  reasonButton: {
    padding: 15,
    width: "100%",
  },
  reasonText: {
    fontFamily: "Nunito-ExtraBold",
    fontSize: 16,
    color: "#fff",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    width: "100%",
  },
  confirmationContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#2E3B42",
    alignItems: "center",
    width: "80%",
  },
  confirmationText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  reasonBold: {
    fontWeight: "bold",
  },
  confirmButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#8AC149",
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontFamily: "Nunito-ExtraBold",
    fontSize: 16,
  },
});

export default ReportModal;
