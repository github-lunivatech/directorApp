// screens/LogoutScreen.js
import React from "react";
import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LogoutScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.clear();
      console.log("AsyncStorage cleared successfully");

      // Navigate to the login screen
      navigation.replace("Login");
      console.log("Navigated to Login screen");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  return (
    <View>
      <Text>Logout Screen</Text>
      <Button title="Logoutssss" onPress={handleLogout} />
    </View>
  );
};

export default LogoutScreen;
