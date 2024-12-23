import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { postComment } from "../../api";
import useUserStore from "../../stores/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const CommentsModal = ({
  visible,
  onClose,
  postId,
  userData,
  comments: initialComments,
  onCommentsUpdate, // Accept the callback as a prop
}) => {
  const { t } = useTranslation();
  const { userId } = useUserStore();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);



  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") return;

    const commentToPost = {
      text: newComment,
      userId,
      postId,
    };

    try {
      const response = await postComment(commentToPost);
      const newCommentObject = {
        _id: response._id,
        text: newComment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: {
          _id: userId,
          username: userData?.user.username || "You",
          profilePicture: userData?.user.profilePicture || "",
        },
      };

      const updatedComments = [...comments, newCommentObject];
      setComments(updatedComments);
      setNewComment("");
      setError(null);

      // Update the parent component with the new comments count
      onCommentsUpdate(updatedComments.length);
    } catch (error) {
      setError(t("comments_modal.error"));
      console.error("API error:", error);
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.comment}>
      <View style={styles.commentHeader}>
        {item?.userId?.profilePicture ? (
          <Image
            source={{ uri: item.userId.profilePicture }}
            style={styles.profilePicture}
          />
        ) : (
          <Image
            source={require("../../assets/user.png")}
            style={styles.profilePicture}
          />
        )}
        <View style={styles.commentContent}>
          <Text style={styles.username}>
            {item?.userId?.username || "Anonymous"}
          </Text>
          <Text style={styles.commentText}>{item.text}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t("comments_modal.title")}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={
              <Text style={styles.noCommentsText}>
                {t("comments_modal.no_comments")}
              </Text>
            }
          />

          {userId ? (
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.input}
                placeholder={t("comments_modal.write_comment")}
                placeholderTextColor="#000000"
                value={newComment}
                onChangeText={setNewComment}
              />

              <Pressable
                style={styles.submitButton}
                onPress={handleCommentSubmit}
              >
                <Ionicons name="send" size={24} color="white" />
              </Pressable>
            </View>
          ) : (
            <Text style={styles.loginPrompt}>
              {t("comments_modal.login_prompt")}
            </Text>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#0F1F26",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: "80%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  modalTitle: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Nunito-ExtraBold",
  },
  comment: {
    backgroundColor: "#0F2630",
    borderRadius: 16,
    marginBottom: 10,
    padding: 16,
  },
  noCommentsText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Nunito-Bold",
    textAlign: "center",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    alignSelf: "flex-start",
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 10,
  },
  profilePicturePlaceholder: {
    alignSelf: "flex-start",
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  username: {
    fontFamily: "Nunito-ExtraBold",
    fontSize: 18,
    color: "#fff",
    marginBottom: 5,
  },
  commentText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Nunito-SemiBold",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 50,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
    fontFamily: "Nunito-Medium",
  },
  submitButton: {
    backgroundColor: "#8AC149",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    fontFamily: "Nunito-Medium",
    marginTop: 5,
  },
  loginPrompt: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    fontFamily: "Nunito-SemiBold",
  },
});

export default CommentsModal;
