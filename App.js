import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import "./global.css";
import * as SplashScreen from "expo-splash-screen";
import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import HomeScreen from "./Screens/HomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import Toast from "react-native-simple-toast";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { StyleSheet } from "react-native";
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  //Handle Logout
  const handleLogout = async () => {
    await AsyncStorage.removeItem("jwtToken");
    await AsyncStorage.removeItem("userName");
    await AsyncStorage.removeItem("userId");
    Toast.show("You are logged out");
    setIsLoggedIn(false);
  };

  //Check for token on app load
  const getToken = async () => {
    const token = await AsyncStorage.getItem("jwtToken");
    const userName = await AsyncStorage.getItem("userName");
    if (token) {
      setIsLoggedIn(true);
      setUserName(userName);
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    getToken();
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
  }, [isLoggedIn]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {isLoggedIn ? (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: `${userName}'s Noter`,
              headerRight: () => (
                <TouchableOpacity
                  onPress={handleLogout}
                  style={styles.logoutButton}
                >
                  <Text style={styles.logoutText}>Logout</Text>
                  <MaterialIcons name="logout" size={18} color="red" />
                </TouchableOpacity>
              ),
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
        ) : (
          <>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {(props) => (
                <LoginScreen
                  {...props}
                  onLoginSuccess={() => setIsLoggedIn(true)}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
