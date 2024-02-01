// LogoutScreen.js
import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LogoutScreen = ({ navigation, setIsLoggedIn }) => {
  const handleLogout = async () => {
    try {
      // Clear user details from AsyncStorage
      await AsyncStorage.removeItem("userDetails");

      // Update the isLoggedIn state to false
      setIsLoggedIn(false);

      // Navigate back to the login screen
      navigation.replace("Login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    // Automatically initiate logout when the component mounts
    handleLogout();
  }, [setIsLoggedIn]);

  return (
    <View style={styles.container}>
      <Text>Logging out...</Text>
      {/* You can add a loading spinner or any other UI elements if needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LogoutScreen;
