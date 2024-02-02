import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import theme from "../theme";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LineChart } from "react-native-chart-kit";

const FinancialScreen = ({ navigation }) => {
  const handlePress = (routeName) => {
    if (routeName) {
      navigation.navigate(routeName);
    }
  };

  const touchableData = [
    {
      key: "CashSales",
      heading: "Cash, Due, Credit Sales Report",
      description: "Get insights into cash, due, and credit sales data.",
      icon: "credit-card", // Change to the desired icon name
    },
    {
      key: "TotalSales",
      heading: "Total Sales Report Datewise",
      description: "View the total sales report based on date range.",
      icon: "info", // Change to the desired icon name
    },
    {
      key: "PartyWiseSales",
      heading: "PartyWise Sales By Date range",
      description:
        "Check sales data categorized by parties within a date range.",
      icon: "watch", // Change to the desired icon name
    },
    {
      key: "RefererWiseSales",
      heading: "Referer Wise Sales By Date Range",
      description:
        "Analyze sales data based on referers within a specific date range.",
      icon: "business", // Change to the desired icon name
    },
    {
      key: "TestWiseSales",
      heading: "Test Wise Sales Report",
      description: "View sales data categorized by different tests.",
      icon: "info", // Change to the desired icon name
    },
    {
      key: "TestCountReport",
      heading: "Test Count Report",
      description: "Explore the count of different tests conducted.",
      icon: "info", // Change to the desired icon name
    },
  ];

  // Sample data for the line chart

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(255, 255,0, ${0.8})`,
        strokeWidth: 4, // Width of the line
      },
      {
        data: [10, 90, 65, 40, 75, 90],
        color: (opacity = 1) => `rgba(0, 255, 0, ${0.8})`,
        strokeWidth: 4,
      },
    ],
    legend: ["Credit Sales", "Cash Sales"],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headingText}>Sales Figures</Text>

      {/* Line Chart */}
      <LineChart
        data={chartData}
        width={350}
        height={200}
        withShadow={false}
        withDots={false}
        yAxisLabel=""
        yAxisSuffix="k"
        chartConfig={{
          backgroundGradientFrom: "#FFF",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={{ alignSelf: "center", marginTop: 10, marginRight: 20 }}
        bezier
      />

      {touchableData.map(({ key, heading, description, icon }, index) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.touchable,
            { backgroundColor: index % 2 === 0 ? "#F6F5FB" : "#FFF4F4" },
          ]}
          onPress={() => handlePress(key)}
        >
          <View style={styles.touchableContent}>
            <Icon
              name={icon}
              size={20}
              color={index % 2 === 0 ? "#403572" : "#FF5648"}
              style={styles.icon}
            />
            <View>
              <Text
                style={[
                  styles.touchableHeading,
                  { color: index % 2 === 0 ? "#403572" : "#FF5648" },
                ]}
              >
                {heading}
              </Text>
              <Text
                style={[
                  styles.touchableDescription,
                  { color: index % 2 === 0 ? "#403572" : "#A27A7A" },
                ]}
              >
                {description}
              </Text>
            </View>
          </View>
          <Icon
            name="keyboard-arrow-right"
            size={24}
            color="grey"
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 20,
  },
  touchable: {
    width: "90%",
    marginVertical: 10,
    borderRadius: 5,
    padding: 10,
    flexDirection: "row", // Align icon horizontally
    position: "relative",
    height: 130, // Enable positioning
  },
  touchableContent: {
    flex: 1, // Allow content to take remaining space
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center", // Center items vertically
  },
  icon: {
    marginRight: 10,
    marginTop: -40,
  },
  touchableHeading: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
  },
  touchableDescription: {
    color: "#fff",
    fontSize: 12,
    marginRight: 70,
    marginTop: 10,
  },
  arrowIcon: {
    position: "absolute",
    right: 10,
    top: 55,
  },
  headingText: {
    color: "#000",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: 20,
  },
});

export default FinancialScreen;
