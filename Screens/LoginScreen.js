import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-simple-toast";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const LoginScreen = ({ onLoginSuccess }) => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const goToRegister = () => {
    navigation.navigate("Register");
  };

  const handleLogin = () => {
    setLoading(true);
    setError(null);
    if (username !== "" && password !== "") {
      axios
        .post("https://noter-server-zyvf.onrender.com/login", {
          username,
          password,
        })
        .then((response) => {
          const jwtToken = response.data.jwtToken;
          const userId = response.data.userId;
          const userName = response.data.userName;
          const asyncFunction = async () => {
            await AsyncStorage.setItem("jwtToken", jwtToken);
            await AsyncStorage.setItem("userName", userName);
            await AsyncStorage.setItem("userId", userId);
          };
          asyncFunction();
          Toast.show(response.data.message);
          onLoginSuccess();
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
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
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
        <Text onPress={goToRegister} style={styles.registerText}>
          Don't have an account?{" "}
          <Text style={styles.registerLink}>Register</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
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
  loginButton: {
    backgroundColor: "black",
    paddingVertical: 8,
    width: "100%",
    marginTop: 24,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  registerText: {
    textAlign: "center",
    marginTop: 16,
  },
  registerLink: {
    color: "#3B82F6",
  },
});

export default LoginScreen;
