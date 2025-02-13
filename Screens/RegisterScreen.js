import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-simple-toast";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const navigation = useNavigation();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const goToLogin = () => {
    navigation.navigate("Login");
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    if (username !== "" && password !== "" && email !== "") {
      axios
        .post("https://noter-server-zyvf.onrender.com/register", {
          username,
          password,
          email,
        })
        .then((response) => {
          Toast.show(response.data.message);
          navigation.navigate("Login");
        })
        .catch((error) => {
          setError(error.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      Toast.show("Please fill all fields");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.label}>Username</Text>
        <TextInput
          value={username}
          onChangeText={(newValue) => setUsername(newValue.trim())}
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor="#9CA3AF"
          required
        />
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            value={password}
            onChangeText={(newValue) => setPassword(newValue.trim())}
            style={styles.passwordInput}
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            required
            secureTextEntry={!showPassword}
          />
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color="#aaa"
            onPress={toggleShowPassword}
          />
        </View>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={(newValue) => setEmail(newValue.trim())}
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#9CA3AF"
          required
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          onPress={handleRegister}
          style={styles.registerButton}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.registerButtonText}>Register</Text>
          )}
        </TouchableOpacity>
        <Text onPress={goToLogin} style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Login</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC", 
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    width: "85%",
    paddingVertical: 30, 
    paddingHorizontal: 22, 
    borderRadius: 10, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, 
  },
  title: {
    fontSize: 24, 
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    fontSize: 18, 
    fontWeight: "500", 
    marginTop: 16, 
   },
  input: {
    fontSize: 18, 
    backgroundColor: "#F3F4F6", 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 4, 
    marginTop: 4, 
    width: "100%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6", 
    paddingHorizontal: 8, 
    borderRadius: 4, 
    marginTop: 4, 
    width: "100%",
  },
  passwordInput: {
    fontSize: 18, 
    backgroundColor: "transparent",
    paddingVertical: 8, 
    flex: 1,
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444", 
    marginTop: 4, 
  },
  registerButton: {
    backgroundColor: "black",
    paddingVertical: 8, 
    width: "100%",
    marginTop: 24, 
    borderRadius: 4, 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  registerButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  loginText: {
    textAlign: "center",
    marginTop: 16,
  },
  loginLink: {
    color: "#3B82F6",
  },
});

export default RegisterScreen;
