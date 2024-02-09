import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MessageScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        Message feature will be updated soon. Stay tuned!
      </Text>
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
  message: {
    fontSize: 20,
    textAlign: "center",
    color: "#333",
  },
});

export default MessageScreen;
