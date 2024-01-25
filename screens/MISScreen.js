import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import theme from "../theme";
const MISScreen = ({ navigation }) => {
  const handlePress = (key) => {
    let routeName = "";
    switch (key) {
      case "touchable1":
        routeName = "TotalSales";
        break;
      case "touchable2":
        routeName = "PartyWiseSales";
        break;
      case "touchable3":
        routeName = "GeographyReport";
        break;
      case "touchable4":
        routeName = "CashSales";
        break;
      case "touchable5":
        routeName = "DymanicReport";
        break;

      default:
        // Handle default case or do nothing
        break;
    }

    // Navigate to the determined route
    if (routeName) {
      navigation.navigate(routeName);
    }
  };

  const touchableData = {
    touchable1: "Age Wise Report By Date Range",
    touchable2: "Total Male, Female, Others Report",
    touchable3: "Geographical Report ",
    touchable4: "Positive/Negative, Reactive non reactive count Report",
    touchable5: "Dynamic Report With input Date Range and Report Type",
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
});

export default MISScreen;
