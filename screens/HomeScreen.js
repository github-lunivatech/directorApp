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
import logo from "../assets/96-96.png";
import theme from "../theme";
import { makeApiRequest, apiEndpoints } from "../services/constants/url";
const HomeScreen = ({ navigation }) => {
  const [companyDetails, setCompanyDetails] = useState(null);
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        // Make API call to get company details
        const response = await makeApiRequest(apiEndpoints.GetCompanyDetails);

        // Assuming the response contains the data field with company details
        setCompanyDetails(response.ReportType[0]);
        // console.log(response);
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    // Call the fetchCompanyDetails function
    fetchCompanyDetails();
  }, []);

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
    }
  };

  return (
    <View style={styles.container}>
      {/* Display Company Details on Top of Dashboard */}
      {companyDetails && (
        <View style={styles.companyDetails}>
          {companyDetails.COmpanyLOgo && (
            <Image
              source={{
                uri: `data:image/jpeg;base64,${companyDetails.COmpanyLOgo}`,
              }}
              style={styles.logo}
            />
          )}
          <Text>{`Company Name: ${companyDetails.CompanyName}`}</Text>
          <Text>{`Address: ${companyDetails.COmpanyAddress}`}</Text>
          <Text>{`Contact No: ${companyDetails.COmpanyContactNo}`}</Text>

          {/* Add more details as needed */}
        </View>
      )}
      {/* Main Content */}

      {/* Dashboard */}
      <View style={styles.dashboardButtons}>
        <TouchableOpacity style={styles.dasButton}>
          <Icon name="bar-chart" size={40} color="#fff" />
          <Text style={styles.navButtonText}>Sales</Text>
          <Text style={styles.navButtonText}>1000</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dasButton}>
          <Icon name="user" size={40} color="#fff" />
          <Text style={styles.navButtonText}>Patient</Text>
          <Text style={styles.navButtonText}>500</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dasButton}>
          <Icon name="users" size={40} color="#fff" />
          <Text style={styles.navButtonText}>Staff</Text>
          <Text style={styles.navButtonText}>50</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.bigNavButton}
            onPress={() => navigateToOtherScreen("a")}
          >
            <Icon name="line-chart" size={30} color="#fff" />
            <Text style={styles.navButtonText}>Finance </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bigNavButton}
            onPress={() => navigateToOtherScreen("b")}
          >
            <Icon name="medkit" size={30} color="#fff" />
            <Text style={styles.navButtonText}>Medical </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.bigNavButton}
            onPress={() => navigateToOtherScreen("c")}
          >
            <Icon name="flask" size={30} color="#fff" />
            <Text style={styles.navButtonText}>MIS </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bigNavButton}
            onPress={() => navigateToOtherScreen("d")}
          >
            <Icon name="pie-chart" size={30} color="#fff" />
            <Text style={styles.navButtonText}>Analysis</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.bigNavButton}
            onPress={() => navigateToOtherScreen("e")}
          >
            <Icon name="cube" size={30} color="#fff" />
            <Text style={styles.navButtonText}>Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bigNavButton}
            onPress={() => navigateToOtherScreen("f")}
          >
            <Icon name="gear" size={30} color="#fff" />
            <Text style={styles.navButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff", // Light background color
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 10,
    alignSelf: "center",
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

  subheading: {
    fontSize: 16,
    color: "#orange", // Subheading text color
  },
  navigationButtons: {
    display: "flex",
    justifyContent: "space-evenly",
    width: "80%",
    marginTop: 20,
  },
  navButton: {
    backgroundColor: theme.primaryColor,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dashboardItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3498db",
    borderRadius: 10,
    padding: 15,
    margin: 5,
  },
  dasButton: {
    backgroundColor: theme.primaryColor,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: 110,
  },

  bigNavButton: {
    backgroundColor: theme.primaryColor,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    margin: 10,
    width: 165,
  },
  dashboardButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  navigationButtons: {
    display: "flex",
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
  },
  rows: {
    marginLeft: 90,
  },
  companyDetails: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default HomeScreen;
