// screens/LogoutScreen.js
import React from "react";
import { View, Text, Button } from "react-native";

const LogoutScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Add your logout logic here
    navigation.replace("Login");
  };

  return (
    <View>
      <Text>Logout Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default LogoutScreen;
