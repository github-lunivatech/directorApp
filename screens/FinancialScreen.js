import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import theme from "../theme";
import Icon from "react-native-vector-icons/MaterialIcons";
import { PieChart } from "react-native-chart-kit";
import { makeApiRequest, apiEndpoints } from "../services/constants/url";

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
      icon: "credit-card",
    },
    {
      key: "TotalSales",
      heading: "Total Sales Report Datewise",
      description: "View the total sales report based on date range.",
      icon: "info",
    },
    {
      key: "PartyWiseSales",
      heading: "PartyWise Sales By Date range",
      description:
        "Check sales data categorized by parties within a date range.",
      icon: "watch",
    },
    {
      key: "PartyWiseSummary",
      heading: "PartyWise Summary By Date range",
      description:
        "Check sales data categorized by parties within a date range.",
      icon: "watch",
    },
    {
      key: "RefererWiseSales",
      heading: "Referer Wise Sales By Date Range",
      description:
        "Analyze sales data based on referers within a specific date range.",
      icon: "business",
    },
    {
      key: "TestWiseSales",
      heading: "Test Wise Sales Report",
      description: "View sales data categorized by different tests.",
      icon: "info",
    },
    {
      key: "TestCountReport",
      heading: "Test Count Report",
      description: "Explore the count of different tests conducted.",
      icon: "info",
    },
  ];

  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    fetchDataForPieChart();
  }, []);

  const fetchDataForPieChart = async () => {
    try {
      const toDate = new Date().toISOString().split("T")[0];
      const apiEndpoint =
        apiEndpoints.GetDataMetricReportByReportTypeAndDateRange;
      const params = {
        from: toDate,
        to: toDate,
        reportType: "SalesofWeekByBillType",
      };
      const response = await makeApiRequest(apiEndpoint, params);
      setChartData(response?.ReportDetails);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headingText}>Sales Figures</Text>

      {chartData.length > 0 && (
        <View style={styles.chartContainer}>
          <PieChart
            data={chartData.map((entry) => ({
              name: entry.BIllPaymentType,
              value: entry.Total,
              color: getRandomColor(),
            }))}
            width={350}
            height={200}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={{ alignSelf: "center", marginTop: 10, marginRight: 20 }}
          />
        </View>
      )}

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
