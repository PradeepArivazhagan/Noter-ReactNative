import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
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
    <View className="bg-slate-50 flex-1 flex-col items-center justify-center">
      <View className="bg-white w-[80%] py-8 px-6 rounded-md shadow-md flex flex-col items-start">
        <Text className="text-3xl font-bold mx-auto">Register</Text>
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
            className="text-lg bg-gray-100 py-2 placeholder:text-gray-300"
            type="text"
            placeholder="Enter your password"
            required
            secureTextEntry
          />
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color="#aaa"
            onPress={toggleShowPassword}
          />
        </View>
        <Text className="mt-3 text-xl font-medium">Email</Text>
        <TextInput
          value={email}
          onChangeText={(newValue) => setEmail(newValue.trim())}
          className="text-lg outline-0 bg-gray-100 py-2 px-3 rounded mt-1 w-full placeholder:text-gray-300"
          type="text"
          placeholder="Enter your email"
          required
        />
        {error && <Text className="text-sm text-red-500 mt-1">{error}</Text>}
        <TouchableOpacity
          onPress={handleRegister}
          className="bg-black py-2 w-full mt-6 rounded flex flex-row items-center justify-center"
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white text-lg font-semibold">Register</Text>
          )}
        </TouchableOpacity>
        <Text onPress={goToLogin} className="mx-auto mt-4">
          Already have an account? <Text className="text-blue-500">Login</Text>
        </Text>
      </View>
    </View>
  );
};

export default RegisterScreen;
