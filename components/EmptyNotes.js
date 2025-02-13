import { View, Image, Text, StyleSheet } from "react-native";
import NoNotes from "../assets/NoNotes.png";
const EmptyNotes = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={NoNotes} style={styles.image} />
        <Text style={styles.message}>
          You have no notes yet. Click the "Add" button to start adding new
          ones.
        </Text>
      </View>
      <Text style={styles.footer}>Created by ♥ Pradeep</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingVertical: 56,
  },
  content: {
    flexDirection: "column",
    alignItems: "center",
  },
  image: {
    width: 256,
    height: 256,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 40,
  },
  footer: {
    fontSize: 18,
    fontWeight: "600",
    color: "#D1D5DB",
  },
});

export default EmptyNotes;
