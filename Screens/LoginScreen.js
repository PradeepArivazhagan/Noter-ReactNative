import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
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
    <SafeAreaView className="bg-slate-50 flex-1 flex-col items-center justify-center">
      <View className="bg-white w-[80%] py-8 px-6 rounded-md shadow-md flex flex-col items-start">
        <Text className="text-3xl font-bold mx-auto">Login</Text>
        <Text className="text-xl font-medium mt-4">Username</Text>
        <TextInput
          value={username}
          onChangeText={(newValue) => setUsername(newValue.trim())}
          className="text-lg outline-0 bg-gray-100 py-2 px-3 rounded mt-1 w-full placeholder:text-gray-300"
          type="text"
          placeholder="Enter your username"
          required
        />
        <Text className="mt-3 text-xl font-medium">Password</Text>
        <View className="flex flex-row items-center justify-between bg-gray-100 px-3 rounded mt-1 w-full">
          <TextInput
            value={password}
            onChangeText={(newValue) => setPassword(newValue.trim())}
            className="text-lg bg-transparent placeholder:text-gray-300 py-2"
            type="text"
            placeholder="Enter your password"
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
        {error && <Text className="text-sm text-red-500 mt-1">{error}</Text>}
        <TouchableOpacity
          onPress={handleLogin}
          className="bg-black py-2 w-full mt-6 rounded flex flex-row items-center justify-center"
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white text-lg font-semibold">Login</Text>
          )}
        </TouchableOpacity>
        <Text onPress={goToRegister} className="mx-auto mt-4">
          Don't have an account? <Text className="text-blue-500">Register</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
