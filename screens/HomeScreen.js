import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import theme from "../theme";
import { makeApiRequest, apiEndpoints } from "../services/constants/url";
import patient from "../assets/patient.png";
import staff from "../assets/staff.png";
import LastSevenDaysDateRange from "../components/LastSevenDate";
import LineChart from "../components/LineChart";

const HomeScreen = ({ navigation }) => {
  const [companyDetails, setCompanyDetails] = useState(null);
  const [reportData, setReportData] = useState(null);

  const navigateToOtherScreen = (props) => {
    if (props === "a") {
      navigation.navigate("Financial");
    } else if (props === "b") {
      navigation.navigate("Medical");
    } else if (props === "c") {
      navigation.navigate("MIS");
    } else if (props === "d") {
      navigation.navigate("Analysis");
    } else if (props === "e") {
      navigation.navigate("Inventory");
    } else if (props === "f") {
      navigation.navigate("Setting");
    } else if (props === "g") {
      navigation.navigate("Home");
    }
  };
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await makeApiRequest(apiEndpoints.GetCompanyDetails);
        if (response && response.ReportType && response.ReportType[0]) {
          setCompanyDetails(response.ReportType[0]);
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };
    fetchCompanyDetails();
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const fromDate = new Date(currentDate);
    fromDate.setDate(currentDate.getDate() - 7);

    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(currentDate);

    const fetchData = async () => {
      try {
        const response = await makeApiRequest(
          apiEndpoints.GetDataMetricReportByReportTypeAndDateRange,
          {
            from: formattedFromDate,
            to: formattedToDate,
            reportType: "DirectorAppDashboard",
          }
        );

        if (response && response.ReportDetails) {
          setReportData(response.ReportDetails);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (reportData) {
      setTotalPatient(reportData[0].Test || 0);
      setTotalRevenue(reportData[0].Sales || 0);
      setCreditSales(reportData[0].Patient || 0);
    }
  }, [reportData]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };
  const formatSales = (sales) => {
    if (sales >= 100000) {
      const formattedSales = (sales / 1000).toFixed(1);
      return `${formattedSales}K`;
    }
    return sales.toString();
  };

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [creditSales, setCreditSales] = useState(0);
  const [totalPatient, setTotalPatient] = useState(0);

  // const weeklyRevenue = [100, 200, 150, 300, 250, 100, 200];
  // const weeklyPatients = [100, 300, 450, 200, 250, 300, 200];
  // const weeklyTest = [200, 300, 50, 250, 250, 300, 500];

  const [weeklyRevenue, setWeeklyRevenue] = useState(null);
  const [weeklyPatients, setWeeklyPatients] = useState(null);
  const [weeklyTest, setWeeklyTest] = useState(null);

  useEffect(() => {
    const currentDate = new Date();
    const fromDate = new Date(currentDate);
    fromDate.setDate(currentDate.getDate() - 7);

    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(currentDate);

    const fetchData = async () => {
      try {
        const response = await makeApiRequest(
          apiEndpoints.GetDataMetricReportByReportTypeAndDateRange,
          {
            from: formattedFromDate,
            to: formattedToDate,
            reportType: "WeeklySales",
          }
        );

        if (response && response.ReportDetails) {
          // Extract sales values and store them in an array
          const salesArray = response.ReportDetails.map((item) => item.Sales);
          setWeeklyRevenue(salesArray);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    console.log(weeklyRevenue);
    fetchData();
  }, []);
  useEffect(() => {
    const currentDate = new Date();
    const fromDate = new Date(currentDate);
    fromDate.setDate(currentDate.getDate() - 7);

    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(currentDate);

    const fetchData = async () => {
      try {
        const response = await makeApiRequest(
          apiEndpoints.GetDataMetricReportByReportTypeAndDateRange,
          {
            from: formattedFromDate,
            to: formattedToDate,
            reportType: "WeeklySales",
          }
        );

        if (response && response.ReportDetails) {
          // Extract sales values and store them in an array
          const salesArray = response.ReportDetails.map((item) => item.Sales);
          setWeeklyRevenue(salesArray);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    // console.log(weeklyRevenue);
  }, []);
  useEffect(() => {
    const currentDate = new Date();
    const fromDate = new Date(currentDate);
    fromDate.setDate(currentDate.getDate() - 7);

    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(currentDate);

    const fetchData = async () => {
      try {
        const response = await makeApiRequest(
          apiEndpoints.GetDataMetricReportByReportTypeAndDateRange,
          {
            from: formattedFromDate,
            to: formattedToDate,
            reportType: "WeeklyPatient",
          }
        );

        if (response && response.ReportDetails) {
          // Extract sales values and store them in an array
          const salesArray = response.ReportDetails.map((item) => item.Total);
          setWeeklyPatients(salesArray);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    // console.log(weeklyPatients);
  }, []);
  useEffect(() => {
    const currentDate = new Date();
    const fromDate = new Date(currentDate);
    fromDate.setDate(currentDate.getDate() - 7);

    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(currentDate);

    const fetchData = async () => {
      try {
        const response = await makeApiRequest(
          apiEndpoints.GetDataMetricReportByReportTypeAndDateRange,
          {
            from: formattedFromDate,
            to: formattedToDate,
            reportType: "WeeklyTest",
          }
        );

        if (response && response.ReportDetails) {
          // Extract sales values and store them in an array
          const salesArray = response.ReportDetails.map((item) => item.Total);
          setWeeklyTest(salesArray);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    // console.log(weeklyTest);
  }, []);

  return (
    <View style={styles.container}>
      {/* Display Company Details on Top of Dashboard */}
      {companyDetails && (
        <View style={styles.companyDetails}>
          {companyDetails.companyBanner && (
            <Image
              source={{
                uri: `data:image/jpeg;base64,${companyDetails.companyBanner}`,
              }}
              style={styles.banner}
            />
          )}
          {companyDetails.COmpanyLOgo && (
            <View style={styles.nameLogo}>
              <View
                style={{
                  borderWidth: 6,
                  borderColor: "white",
                  borderRadius: 20,
                }}
              >
                <Image
                  source={{
                    uri: `data:image/jpeg;base64,${companyDetails.COmpanyLOgo}`,
                  }}
                  style={styles.logo}
                />
              </View>
              <Text
                style={{
                  marginTop: 40,
                  marginLeft: 10,
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                {companyDetails.CompanyName}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Main Content */}
      <View style={styles.headingTextContainer}>
        <Text style={styles.headingText}>Weekly Analysis</Text>
        <Text style={styles.headingTextDate}>
          <LastSevenDaysDateRange />
        </Text>
      </View>
      {/* Dashboard */}
      <View style={styles.dashboardButtons}>
        <TouchableOpacity
          style={{ ...styles.dasButton, backgroundColor: "#F6F5FB" }}
        >
          <View style={styles.iconContainers}>
            <Text
              style={{
                ...styles.dasButtonText,
                color: "#61598B",
                fontWeight: 400,
              }}
            >
              TotalRevenue
            </Text>
          </View>
          <Text
            style={{
              ...styles.dasButtonText,
              color: "#61598B",
              alignSelf: "flex-end",
              fontSize: 20,
              marginBottom: -20,
            }}
          >
            {formatSales(totalRevenue)}
          </Text>
          <LineChart data={weeklyRevenue} color="#0062FF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...styles.dasButton, backgroundColor: "#FFF4F4" }}
        >
          <View style={styles.iconContainers}>
            <Text
              style={{
                ...styles.dasButtonText,
                color: "#FF3726",
                fontWeight: 400,
              }}
            >
              Total Patient
            </Text>
          </View>
          <Text
            style={{
              ...styles.dasButtonText,
              color: "#FF3726",
              alignSelf: "flex-end",
              fontSize: 20,
              marginBottom: -20,
            }}
          >
            {creditSales}
          </Text>
          <LineChart data={weeklyPatients} color="#FF5648" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.dasButton, backgroundColor: "#F5F9F9" }}
        >
          <View style={styles.iconContainers}>
            <Text
              style={{
                ...styles.dasButtonText,
                color: "#479696",
                fontWeight: 400,
              }}
            >
              Test
            </Text>
          </View>
          <Text
            style={{
              ...styles.dasButtonText,
              color: "#479696",
              alignSelf: "flex-end",
              fontSize: 20,
              marginBottom: -20,
            }}
          >
            {formatSales(totalPatient)}
          </Text>
          <LineChart data={weeklyTest} color="#479696" />
        </TouchableOpacity>
      </View>

      <View style={styles.headingTextContainer}>
        <Text
          style={[styles.headingText, { marginTop: 30, marginBottom: -10 }]}
        >
          Reports:
        </Text>
      </View>
      {/* Navigation Buttons */}
      <ScrollView horizontal>
        <View style={styles.navigationButtons}>
          <View style={styles.row}>
            <TouchableOpacity
              style={{ ...styles.bigNavButton, backgroundColor: "#F6F5FB" }}
              onPress={() => navigateToOtherScreen("a")}
            >
              <View style={styles.iconContainer}>
                <Icon name="line-chart" size={20} color="#61598B" />
              </View>
              <Text style={{ ...styles.navButtonText, color: "#61598B" }}>
                Financial Reports{" "}
              </Text>
              <Text style={{ color: "#61598B" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod.
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.bigNavButton, backgroundColor: "#F5F9F9" }}
              onPress={() => navigateToOtherScreen("b")}
            >
              <View style={styles.iconContainer}>
                <Icon name="medkit" size={20} color="#479696" />
              </View>
              <Text
                style={{
                  ...styles.navButtonText,
                  color: "#479696",
                  alignSelf: "flex-start",
                }}
              >
                Medical Reports{" "}
              </Text>
              <Text style={{ color: "#479696" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod.
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.bigNavButton, backgroundColor: "#FDF9FB" }}
              onPress={() => navigateToOtherScreen("c")}
            >
              <View style={styles.iconContainer}>
                <Icon name="flask" size={20} color="#C93F8D" />
              </View>
              <Text style={{ ...styles.navButtonText, color: "#C93F8D" }}>
                MIS Reports{" "}
              </Text>
              <Text style={{ color: "#C93F8D" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ ...styles.bigNavButton, backgroundColor: "#F6F5FB" }}
              onPress={() => navigateToOtherScreen("d")}
            >
              <View style={styles.iconContainer}>
                <Icon name="pie-chart" size={20} color="#61598B" />
              </View>
              <Text style={{ ...styles.navButtonText, color: "#61598B" }}>
                Analysis Reports
              </Text>
              <Text style={{ color: "#61598B" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod.
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.bigNavButton, backgroundColor: "#FDF9FB" }}
              onPress={() => navigateToOtherScreen("e")}
            >
              <View style={styles.iconContainer}>
                <Icon name="cube" size={20} color="#C93F8D" />
              </View>
              <Text style={{ ...styles.navButtonText, color: "#C93F8D" }}>
                Inventory
              </Text>
              <Text style={{ color: "#C93F8D" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod.
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.bigNavButton, backgroundColor: "#F5F9F9" }}
              onPress={() => navigateToOtherScreen("f")}
            >
              <View style={styles.iconContainer}>
                <Icon name="gear" size={20} color="#479696" />
              </View>
              <Text style={{ ...styles.navButtonText, color: "#479696" }}>
                Settings
              </Text>
              <Text style={{ color: "grey" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* <BottomTabNagivator navigation={navigation} /> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff", // Light background color
  },
  headingTextContainer: {
    alignSelf: "flex-start",
    marginLeft: 20,
    flexDirection: "row",
    alignContent: "space-around",
    alignItems: "center",
  },
  headingText: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
    color: "#595085",
  },
  headingTextDate: {
    marginLeft: 8,
    color: "grey",
    fontSize: 18,
  },

  dashboardLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff", // Dashboard label text color
  },
  dashboardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // Dashboard value text color
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  dasButtonText: {
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: -5,
    alignSelf: "flex-start",
  },
  dasButton: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: 110,
    height: 120,
  },
  bigNavButton: {
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginLeft: 20,
    width: 250,
    height: 170,
  },

  dashboardButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    height: "14%",
  },
  navigationButtons: {
    display: "flex",
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
  },
  bottomTabNagivator: {
    flexDirection: "row",
    backgroundColor: theme.primaryColor,
    height: "10%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
  },
  bottomTab: {
    alignItems: "center",
    width: 165,
  },
  iconContainer: {
    alignSelf: "flex-start",
    flexDirection: "row",
    marginBottom: 10,
  },
  iconContainers: {
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  salesImage: {
    objectFit: "fill",
    maxWidth: "120%",
  },
  companyDetails: {
    position: "relative",
    width: "100%",
    height: "30%", // Adjust the height as needed
    overflow: "hidden",
  },
  banner: {
    width: "100%",
    height: "70%",
    position: "absolute",
  },
  logo: {
    height: "80%", // Adjust the height as needed
    aspectRatio: 1, // Maintain aspect ratio
    zIndex: 1, // Ensure the logo appears on top
  },
  nameLogo: {
    position: "absolute",
    left: "10%",
    top: "50%",
    height: "50%",
    flexDirection: "row",
  },
});

export default HomeScreen;
