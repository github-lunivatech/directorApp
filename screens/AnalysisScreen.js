import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import theme from "../theme";
const AnalysisScreen = () => {
  const handlePress = (key) => {};

  const touchableData = {
    touchable1: "Sales Projection",
    touchable2: "Test Wise Sales Analysis",
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.keys(touchableData).map((key) => (
        <TouchableOpacity
          key={key}
          style={styles.touchable}
          onPress={() => handlePress(key)}
        >
          <Text style={styles.touchableText}>{touchableData[key]}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 20,
  },
  touchable: {
    width: "90%",
    height: 50, // You can adjust the height as needed
    backgroundColor: theme.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    borderRadius: 5,
  },
  touchableText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  counterText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  lastPressedText: {
    marginTop: 10,
    fontSize: 16,
    color: "#2c3e50",
  },
});

export default AnalysisScreen;
