import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import {
  TextInput,
  Modal,
  Text,
  Pressable,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-simple-toast";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ScrollView } from "react-native";
import EmptyNotes from "../components/EmptyNotes";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";

const HomeScreen = () => {
  const [userId, setUserId] = useState("");

  const getUserId = async () => {
    const userId = await AsyncStorage.getItem("userId");
    setUserId(userId);
  };

  const [notes, setNotes] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editId, setEditId] = useState(null);

  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [showAction, setShowAction] = useState(null);
  const onClickShowAction = (id) => {
    setShowAction((prev) => (prev === id ? null : id));
  };

  //Edit Modal Functions - completed
  const openEditModal = (id) => {
    setEditId(id);
    setEditModalIsOpen(true);

    axios
      .get(`https://noter-server-zyvf.onrender.com/notes/editNote/${id}`)
      .then((response) => {
        setEditTitle(response.data.note.title);
        setEditContent(response.data.note.content);
      })
      .catch((error) => {
        Toast.show("Something went wrong");
        console.error(error.message);
      });
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setEditId(null);
  }; //completed

  //completed
  const onCreateNote = async () => {
    if (title !== "" && content !== "") {
      setLoading(true);
      try {
        const response = await axios.post(
          `https://noter-server-zyvf.onrender.com/notes/createNote`,
          {
            userId,
            title,
            content,
          }
        );
        setNotes([...notes, response.data.note]);
        setTitle("");
        setContent("");
        setCreateModalIsOpen(false);
        Toast.show(response.data.message);
      } catch (error) {
        Toast.show(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      Toast.show("Please add some content");
    }
  };

  //Handling Edit Note - completed
  const handleEditNote = async () => {
    if (editTitle === "" || editContent === "") {
      Toast.show("Please add some content");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(
        `https://noter-server-zyvf.onrender.com/notes/editNote/${editId}`,
        {
          title: editTitle,
          content: editContent,
        }
      );

      const updatedNotes = notes.map((note) =>
        note._id === editId ? response.data.note : note
      );

      setNotes(updatedNotes);
      setEditTitle("");
      setEditContent("");
      closeEditModal();
      Toast.show(response.data.message);
    } catch (error) {
      Toast.show("Something went wrong");
    } finally {
      setShowAction(false);
      setLoading(false);
    }
  };

  //Handling Delete Note - Completed
  const handleDeleteNote = async (id) => {
    try {
      const response = await axios.delete(
        `https://noter-server-zyvf.onrender.com/notes/deleteNote/${id}`
      );
      setNotes(notes.filter((note) => note._id !== id));
      Toast.show(response.data.message);
    } catch (error) {
      Toast.show("Something went wrong");
    }
  };

  //Get all notes of the user LoggedIn - completed
  useEffect(() => {
    getUserId();
    setLoading(true);
    if (!userId) return;
    axios
      .get(`https://noter-server-zyvf.onrender.com/notes?userId=${userId}`)
      .then((response) => {
        setNotes(response.data.notes);
      })
      .catch((error) => {
        Toast.show("Something went wrong");
        console.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
        <TouchableOpacity
          onPress={() => setCreateModalIsOpen(true)}
          style={styles.addButton}
        >
          <AntDesign name="pluscircleo" size={15} color="white" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={createModalIsOpen}
          onRequestClose={() => setCreateModalIsOpen(!createModalIsOpen)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>New Note</Text>
              <TextInput
                value={title}
                onChangeText={(newValue) => setTitle(newValue)}
                style={styles.input}
                placeholder="Title"
              />
              <TextInput
                value={content}
                multiline={true}
                numberOfLines={5}
                onChangeText={(newValue) => setContent(newValue)}
                style={styles.textArea}
                placeholder="Content"
              />
              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => {
                    setCreateModalIsOpen(!createModalIsOpen);
                    setTitle("");
                    setContent("");
                  }}
                  style={styles.closeButton}
                >
                  <AntDesign name="close" size={15} />
                  <Text>Close</Text>
                </Pressable>
                <Pressable onPress={onCreateNote} style={styles.doneButton}>
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <View style={styles.doneButtonContent}>
                      <Text style={styles.doneButtonText}>Done</Text>
                      <AntDesign name="check" size={15} color="white" />
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="black" />
      ) : notes.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.notesContainer}>
            {notes.map((note) => (
              <View key={note._id} style={styles.noteCard}>
                <View style={styles.noteHeader}>
                  <Text style={styles.noteTitle}>{note.title}</Text>
                  <View style={styles.actionsContainer}>
                    {showAction === note._id && (
                      <View style={styles.actionButtons}>
                        <Pressable
                          onPress={() => openEditModal(note._id)}
                          style={styles.iconButton}
                        >
                          <Feather name="edit" size={18} color="green" />
                        </Pressable>
                        <Modal
                          animationType="slide"
                          transparent={true}
                          visible={editModalIsOpen}
                          onRequestClose={() => setEditModalIsOpen(false)}
                        >
                          <View style={styles.editModalContainer}>
                            <View style={styles.editModalContent}>
                              <Text style={styles.editModalTitle}>
                                Edit Note
                              </Text>
                              <TextInput
                                value={editTitle}
                                onChangeText={(editValue) =>
                                  setEditTitle(editValue)
                                }
                                style={styles.editInput}
                                placeholder="Edit Title"
                                placeholderTextColor="#9ca3af"
                              />
                              <TextInput
                                value={editContent}
                                multiline={true}
                                numberOfLines={5}
                                onChangeText={(editValue) =>
                                  setEditContent(editValue)
                                }
                                style={[styles.editInput, styles.editTextArea]}
                                placeholder="Edit Content"
                                placeholderTextColor="#9ca3af"
                              />
                              <View style={styles.editModalActions}>
                                <Pressable
                                  onPress={() => setEditModalIsOpen(false)}
                                  style={styles.editCloseButton}
                                >
                                  <AntDesign name="close" size={15} />
                                  <Text>Close</Text>
                                </Pressable>
                                <Pressable
                                  onPress={handleEditNote}
                                  style={styles.editSaveButton}
                                >
                                  {loading ? (
                                    <ActivityIndicator
                                      size="small"
                                      color="white"
                                    />
                                  ) : (
                                    <View style={styles.editIconButtonRow}>
                                      <Text style={styles.editSaveButtonText}>
                                        Save
                                      </Text>
                                      <AntDesign
                                        name="check"
                                        size={20}
                                        color="white"
                                      />
                                    </View>
                                  )}
                                </Pressable>
                              </View>
                            </View>
                          </View>
                        </Modal>
                        <Pressable
                          onPress={() => handleDeleteNote(note._id)}
                          style={styles.iconButton}
                        >
                          <MaterialCommunityIcons
                            name="delete-outline"
                            size={22}
                            color="red"
                          />
                        </Pressable>
                      </View>
                    )}
                    <Pressable
                      onPress={() => onClickShowAction(note._id)}
                      style={[
                        styles.actionToggle,
                        showAction !== note._id && styles.hiddenAction,
                      ]}
                    >
                      {showAction === note._id ? (
                        <AntDesign
                          name="closecircleo"
                          size={20}
                          color="black"
                        />
                      ) : (
                        <Entypo
                          name="dots-three-vertical"
                          size={20}
                          color="black"
                        />
                      )}
                    </Pressable>
                  </View>
                </View>
                <Text style={styles.noteContent}>{note.content}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <EmptyNotes />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 8,
    padding: 20,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
  },
  input: {
    marginTop: 10,
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    fontSize: 18,
  },
  textArea: {
    marginTop: 8,
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    fontSize: 18,
  },
  modalActions: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  closeButton: {
    padding: 8,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#000",
  },
  doneButton: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  doneButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  doneButtonText: {
    color: "#fff",
  },
  notesContainer: {
    marginTop: 24,
    flexDirection: "column",
    gap: 8,
  },
  noteCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: "600",
    flexShrink: 1,
  },
  noteContent: {
    marginTop: 8,
    fontSize: 18,
    flexShrink: 1,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 50,
    paddingVertical: 1,
    paddingHorizontal: 2,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionToggle: {
    padding: 5,
    borderRadius: 50,
  },
  hiddenAction: {
    backgroundColor: "#f3f4f6",
  },
  iconButton: {
    padding: 2,
    borderRadius: 50,
    backgroundColor: "#f3f4f6",
  },
  editModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  editModalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  editModalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  editInput: {
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    color: "#000",
    marginBottom: 8,
  },
  editTextArea: {
    textAlignVertical: "top",
  },
  editModalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  editCloseButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    borderRadius: 5,
    gap: 4,
  },
  editSaveButton: {
    backgroundColor: "black",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  editSaveButtonText: {
    color: "white",
    marginRight: 4,
  },
  editIconButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});

export default HomeScreen;
