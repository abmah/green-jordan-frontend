import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For the close button icon

const ReportModal = ({ visible, onClose, onReport }) => {
  const reasons = ["Spam", "Hateful", "Graphic Content", "Other"];

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
          {/* Top Section: Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Report</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#F5F5F5" />
            </TouchableOpacity>
          </View>

          {/* Bottom Section: Reasons */}
          <View style={styles.reasonsContainer}>
            {reasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={styles.reasonContainer}
                onPress={() => handleReasonSelect(reason)}
              >
                <View style={styles.radioButtonContainer}>
                  <View
                    style={[
                      styles.radioButton,
                      selectedReason === reason && styles.radioButtonSelected,
                    ]}
                  />
                  <Text style={styles.reasonText}>{reason}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Confirmation Section */}
          <View style={styles.confirmationContainer}>
            <Pressable
              style={[
                styles.confirmButton,
                !selectedReason && styles.disabledButton,
              ]}
              onPress={handleConfirmReport}
              disabled={!selectedReason}
            >
              <Text style={styles.confirmText}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#1B2B38",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "Nunito-Bold",
    color: "#8AC149",
    marginBottom: 10,
    marginTop: 30,
    width: "100%",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  reasonsContainer: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  reasonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#8AC149",
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: "#8AC149",
  },
  reasonText: {
    fontFamily: "Nunito-ExtraBold",
    fontSize: 16,
    color: "#fff",
  },
  confirmationContainer: {
    width: "80%",
  },
  confirmButton: {
    padding: 10,
    backgroundColor: "#ff5536",
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A5A5A5",
  },
  confirmText: {
    color: "#fff",
    fontFamily: "Nunito-ExtraBold",
    fontSize: 16,
  },
});

export default ReportModal;
