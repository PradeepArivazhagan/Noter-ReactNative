import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import {
  TextInput,
  Modal,
  Text,
  Pressable,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-simple-toast";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import NoNotes from "../assets/NoNotes.png";
import { FlatList } from "react-native";
import { ScrollView } from "react-native";

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

  //Empty Note Component - completed
  const EmptyNote = () => {
    return (
      <View className="flex-1 flex-col items-center justify-between px-10 py-14">
        <View className="flex flex-col items-center">
          <Image className=" w-64 h-64" source={NoNotes} alt="empty note" />
          <Text className="text-lg text-center text-gray-400 mt-10">
            You have no notes yet. Click the "Add" button to start adding new
            ones.
          </Text>
        </View>
        <Text className="text-lg font-semibold text-gray-300 italic">
          Created by Pradeep
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50 px-6 py-5">
      <View className="w-full flex flex-row items-center justify-between">
        <Text className="text-2xl font-bold">Notes</Text>
        <TouchableOpacity
          onPress={() => setCreateModalIsOpen(true)}
          className="bg-black py-2 px-4 rounded flex flex-row items-center gap-2"
        >
          <AntDesign name="pluscircleo" size={15} color="white" />
          <Text className="text-white font-medium">Add</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={createModalIsOpen}
          onRequestClose={() => {
            setCreateModalIsOpen(!createModalIsOpen);
          }}
        >
          <View className="flex-1 items-center justify-center">
            <View className="bg-white m-20 rounded-md p-6 shadow-md w-[80%]">
              <Text className="font-semibold text-2xl">New Note</Text>
              <TextInput
                value={title}
                required
                onChangeText={(newValue) => setTitle(newValue)}
                type="text"
                className="mt-3 bg-gray-100 py-2 px-3 w-full placeholder:text-gray-300 rounded-sm text-lg"
                placeholder="Title"
              />
              <TextInput
                value={content}
                multiline={true}
                numberOfLines={5}
                required
                onChangeText={(newValue) => setContent(newValue)}
                type="text"
                className="mt-2 bg-gray-100 py-2 px-3 w-full placeholder:text-gray-300 rounded-sm text-lg"
                placeholder="Content"
              />
              <View className="mt-4 flex flex-row item-center justify-between">
                <Pressable
                  onPress={() => setCreateModalIsOpen(!createModalIsOpen)}
                  className="p-2 rounded-md flex flex-row items-center gap-2 border border-black"
                >
                  <AntDesign name="close" size={15} />
                  <Text>Close</Text>
                </Pressable>
                <Pressable
                  onPress={onCreateNote}
                  className="bg-black py-2 px-4 rounded-md border border-black"
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <View className="flex flex-row items-center gap-2">
                      <Text className="text-white">Done</Text>
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
          <View className="mt-6 flex flex-col gap-3">
            {notes.map((note) => (
              <View
                key={note._id}
                className="bg-white border border-slate-200 rounded-lg p-3 shadow"
              >
                <View className="flex flex-row justify-between items-start gap-3">
                  <Text className="font-semibold text-xl flex-shrink">
                    {note.title}
                  </Text>
                  <View className="flex flex-row items-center gap-1">
                    {showAction === note._id && (
                      <View className="flex flex-row items-center gap-3 bg-gray-100 rounded-full py-1 px-3">
                        <Pressable
                          onPress={() => openEditModal(note._id)}
                          className="rounded-full"
                        >
                          <AntDesign name="edit" size={20} color="green" />
                        </Pressable>
                        <Modal
                          animationType="slide"
                          transparent={true}
                          visible={editModalIsOpen}
                          onRequestClose={() => {
                            setEditModalIsOpen(!editModalIsOpen);
                          }}
                        >
                          <View className="flex-1 items-center justify-center">
                            <View className="bg-white m-20 rounded-md p-6 shadow-md w-[80%]">
                              <Text className="font-semibold text-2xl">
                                Edit Note
                              </Text>
                              <TextInput
                                value={editTitle}
                                required
                                onChangeText={(editValue) =>
                                  setEditTitle(editValue)
                                }
                                type="text"
                                className="mt-3 bg-gray-100 py-2 px-3 w-full placeholder:text-gray-300 rounded-sm text-lg"
                                placeholder="Edit Title"
                              />
                              <TextInput
                                value={editContent}
                                multiline={true}
                                numberOfLines={5}
                                required
                                onChangeText={(editValue) =>
                                  setEditContent(editValue)
                                }
                                type="text"
                                className="mt-2 bg-gray-100 py-2 px-3 w-full placeholder:text-gray-300 rounded-sm text-lg"
                                placeholder="Edit Content"
                              />
                              <View className="mt-4 flex flex-row item-center justify-between">
                                <Pressable
                                  onPress={() =>
                                    setEditModalIsOpen(!setEditModalIsOpen)
                                  }
                                  className="p-2 rounded-md flex flex-row items-center gap-2 border border-black"
                                >
                                  <AntDesign name="close" size={15} />
                                  <Text>Close</Text>
                                </Pressable>
                                <Pressable
                                  onPress={handleEditNote}
                                  className="bg-black py-2 px-4 rounded-md border border-black"
                                >
                                  {loading ? (
                                    <ActivityIndicator
                                      size="small"
                                      color="white"
                                    />
                                  ) : (
                                    <View className="flex flex-row items-center gap-2">
                                      <Text className="text-white">Save</Text>
                                      <AntDesign
                                        name="check"
                                        size={15}
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
                          className="rounded-full"
                        >
                          <AntDesign name="delete" size={20} color="red" />
                        </Pressable>
                      </View>
                    )}
                    <Pressable
                      onPress={() => onClickShowAction(note._id)}
                      className={`p-1 text-xl ${
                        showAction !== note._id && "bg-gray-100"
                      } rounded-full`}
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
                <Text className="mt-2 text-lg flex-shrink">{note.content}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <EmptyNote />
      )}
    </View>
  );
};

export default HomeScreen;
