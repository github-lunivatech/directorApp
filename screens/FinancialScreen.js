import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import theme from "../theme";
const FinancialScreen = ({ navigation }) => {
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
        routeName = "RefererWiseSales";
        break;
      case "touchable4":
        routeName = "CashSales";
        break;
      case "touchable5":
        routeName = "TestWiseSales";
        break;
      case "touchable6":
        routeName = "TestCountReport";
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
    touchable1: "Total Sales Report Datewise",
    touchable2: "PartyWise Sales By Date range",
    touchable3: "Referer Wise Sales By Date Range",
    touchable4: "Cash, Due, Credit Sales Report",
    touchable5: "Test Wise Sales Report",
    touchable6: "Test Count Report",
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

export default FinancialScreen;
