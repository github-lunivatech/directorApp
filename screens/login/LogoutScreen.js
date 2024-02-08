import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LogoutScreen = ({ setIsLoggedIn }) => {
  const handleLogout = async () => {
    // Perform logout actions, such as clearing user data from AsyncStorage
    await AsyncStorage.removeItem("userToken");
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Logout</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    width: "80%",
    height: 40,
    backgroundColor: "tomato",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LogoutScreen;
