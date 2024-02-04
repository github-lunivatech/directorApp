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
import { LineChart } from "react-native-chart-kit";
import { makeApiRequest, apiEndpoints } from "../services/constants/url";

const FinancialScreen = ({ navigation }) => {
  const [isLineChartLoaded, setLineChartVisibility] = useState(false);
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
      key: "PartyWiseSummary",
      heading: "PartyWise Summary By Date range",
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

  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ["Rainy Days"], // optional
  };

  const [chartData, setChartData] = useState({
    labels: [],
    color: [],
    datasets: [],

    legend: ["Credit Sales", "Cash Sales"],
  });

  useEffect(() => {
    // Fetch and process the data for the line chart
    fetchDataForLineChart();
  }, []); // Fetch data when the component mounts

  const fetchDataForLineChart = async () => {
    try {
      // Calculate date range from today to 7 days before
      const toDate = new Date().toISOString().split("T")[0];
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 7);
      const fromDateStr = fromDate.toISOString().split("T")[0];

      // Make API call with the calculated date range
      const apiEndpoint =
        apiEndpoints.GetDataMetricReportByReportTypeAndDateRange;
      const params = {
        from: fromDateStr,
        to: toDate,
        reportType: "SalesofWeekByBillType",
      };

      const response = await makeApiRequest(apiEndpoint, params);
      console.log(response);
      // Inside your fetchDataForLineChart after fetching data

      const processedData = processDataForLineChart(response.ReportDetails);
      console.log(processedData, "THis is process data");
      setChartData(processedData || 0);
      console.log(chartData, "This is chartdata");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const processDataForLineChart = (data) => {
    const chartData = {
      labels: [],
      datasets: [],
      legend: ["Credit Sales", "Cash Sales"],
    };

    const creditSales = {
      data: [],
      color: (opacity = 1) => `rgba(0, 255, 0, ${1})`,
      strokeWidth: 4,
    };

    const cashSales = {
      data: [],
      color: (opacity = 1) => `rgba(255, 255, 0, ${1})`,
      strokeWidth: 4,
    };

    data.forEach((entry) => {
      const formattedDate = new Date(entry.Date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      chartData.labels.push(formattedDate);

      if (entry.BIllPaymentType === "Credit") {
        creditSales.data.push(entry.Total);
        cashSales.data.push(null); // Placeholder for Cash Sales if Credit data not present
      } else if (entry.BIllPaymentType === "Cash") {
        cashSales.data.push(entry.Total);
        creditSales.data.push(null); // Placeholder for Credit Sales if Cash data not present
      }
    });
    chartData.datasets.push(creditSales, cashSales);
    console.log(chartData, "This is chartdata part 2");

    setTimeout(() => {
      setLineChartVisibility(true);
    });
    return chartData;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headingText}>Sales Figures</Text>

      {/* Line Chart */}
      {isLineChartLoaded && (
        <LineChart
          data={chartData}
          width={360}
          height={210}
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
