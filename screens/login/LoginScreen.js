// LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeApiRequest, apiEndpoints } from "../../services/constants/url";

const LoginScreen = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // Make API request to validate login credentials
      const response = await makeApiRequest(
        apiEndpoints.GetValidCollectorLoginForApp,
        {
          username: username,
          password: password,
        }
      );

      // Check if the API response indicates successful login
      if (
        response &&
        response.validuserDetails &&
        response.validuserDetails.length > 0
      ) {
        // Store user details in AsyncStorage
        const userDetails = response.validuserDetails[0];
        await AsyncStorage.setItem("userDetails", JSON.stringify(userDetails));

        // Invoke the callback to notify successful login
        onLoginSuccess();
      } else {
        // Display error alert for invalid credentials
        Alert.alert("Error", "Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Display error alert for API request failure
      Alert.alert("Error", "Failed to login. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;
