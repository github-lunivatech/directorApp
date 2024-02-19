import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  UIManager,
  BackHandler,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Table, Row } from "react-native-table-component";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import theme from "../../../theme";
import Icon from "react-native-vector-icons/Feather";
import { ActivityIndicator } from "react-native-paper";
import ExportToPDFButton from "../../../components/ExportToPDFLandscape";

import { makeApiRequest, apiEndpoints } from "../../../services/constants/url";

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const CashSales = (route) => {
  const [isLoading, setLoading] = useState(false);

  // State to manage filters
  const [fromDate, setFromDate] = useState(new Date().toISOString());
  const [toDate, setToDate] = useState(new Date().toISOString());

  // State to store filtered data for the table
  const [filteredData, setFilteredData] = useState([]);

  // State for dynamic columns from the backend
  const [columns, setColumns] = useState([]);

  // State to manage datetime picker visibility
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState("");

  const [isDataVisible, setDataVisibility] = useState(false);

  const applyFilters = async () => {
    try {
      setLoading(true); // Set loading to true when starting data fetch
      const response = await makeApiRequest(
        apiEndpoints.GetDailyTransactionByUserIdAndDate,
        {
          from: fromDate,
          to: toDate,
          userId: 0,
        }
      );
      console.log(fromDate, "This is the date");
      console.log("API Response:", response);

      // Extract the array of data from the response
      const data = response["ReportDetails"] || [];

      // Use the keys of the first item as columns
      const keys = Object.keys(data[0] || {});
      const newColumns = keys.map((key) => ({ key, label: key }));

      // Set columns and filteredData
      setColumns(newColumns);
      setFilteredData(data);
      setDataVisibility(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Data not available");
    } finally {
      setLoading(false);
    }
  };

  // Toggle datetime picker visibility
  const toggleDatePicker = (field) => {
    setDatePickerVisibility(!isDatePickerVisible);
    setSelectedDateField(field);
  };

  // Handle datetime picker change
  const handleDatePickerChange = (selectedDate) => {
    if (selectedDate) {
      if (selectedDateField === "fromDate") {
        setFromDate(selectedDate.toISOString());
      } else if (selectedDateField === "toDate") {
        setToDate(selectedDate.toISOString());
      }
    }
    setDatePickerVisibility(false);
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const handleTouchableOpacityPress = (data) => {
    setSelectedData(data);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedData(null);
  };
  const [areFiltersVisible, setFiltersVisibility] = useState(false);

  const toggleFilters = () => {
    setFiltersVisibility(!areFiltersVisible);
  };

  const formatDate = (timestamp) => {
    const dateObject = new Date(timestamp);
    return dateObject
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
      .replace("at", ",");
  };
  const getBackgroundColor = (paymentType) => {
    switch (paymentType) {
      case "Cash":
        return "#E0FFF1";
      case "Credit":
        return "#FFE6E6";
      case "CreditCollection":
        return "#E0FFF1";
      case "DueCollection":
        return "#FFE6E6";
      case "Due":
        return "#FFE6E6";
      case "Card":
        return "#E0FFF1";
      case "Bank":
        return "#E0FFF1";
      default:
        return "#FFFFFF";
    }
  };

  const getTextColor = (paymentType) => {
    switch (paymentType) {
      case "Cash":
        return "#3DD598";
      case "Credit":
        return "#FF6347";
      case "CreditCollection":
        return "#FF6347";
      case "DueCollection":
        return "#FF6347";
      case "Due":
        return "#FF6347";
      case "Card":
        return "#3DD598";
      case "Bank":
        return "#3DD598";
      default:
        return "#000000";
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Toggle Overview and Filters */}
        <View style={styles.overviewContainer}>
          <Text style={styles.overviewText}>Overview</Text>
          <TouchableOpacity onPress={toggleFilters} style={styles.toggleButton}>
            <Text style={styles.overviewTextButton}>
              Show: Today
              <Icon
                name={areFiltersVisible ? "chevron-down" : "chevron-up"}
                size={15}
                color="grey"
              />
            </Text>
          </TouchableOpacity>

          {/* Filters */}
          {areFiltersVisible && (
            <ScrollView horizontal={true}>
              <View style={styles.filterContainer}>
                {/* First Row of Filters */}
                <View style={styles.filterItem}>
                  <TouchableOpacity
                    onPress={() => toggleDatePicker("fromDate")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>
                      From Date:{" "}
                      {fromDate ? fromDate.split("T")[0] : "Select Date"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.filterItem}>
                  <TouchableOpacity
                    onPress={() => toggleDatePicker("toDate")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>
                      To Date:{toDate ? toDate.split("T")[0] : "Select Date"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}

          {isDataVisible &&
            (isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ExportToPDFButton
                tableData={filteredData}
                pageTitle="Cash, Due, Credit Sales Report"
                reportType="Cash, Due, Credit Sales"
                row={2}
              />
            ))}
          <TouchableOpacity
            onPress={applyFilters}
            style={[
              styles.button,
              styles.applyButton,
              { alignSelf: "flex-end" },
            ]}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={[styles.buttonText, { color: "#fff" }]}>
                Apply Filters
              </Text>
            )}
          </TouchableOpacity>
        </View>
        {/* Date Time Picker */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDatePickerChange}
          onCancel={() => setDatePickerVisibility(false)}
        />
        {/*TouchableOpacity Components */}
        {isDataVisible && (
          <ScrollView>
            {filteredData.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleTouchableOpacityPress(item)}
                style={[
                  styles.touchableOpacity,
                  {
                    backgroundColor: getBackgroundColor(item.PaymentTYpe),
                  },
                ]}
              >
                <View style={{ flexDirection: "row", marginBottom: -10 }}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.touchableOpacityText,
                      {
                        fontWeight: "bold",
                        color: "#000",
                        marginTop: 10,
                        flex: 2,
                        marginRight: 0,
                        alignSelf: "flex-start",
                        marginLeft: 10,
                      },
                    ]}
                  >
                    {item.FirstName} {item.LastName}{" "}
                    <Text
                      style={{
                        fontWeight: "normal",
                        color: "grey",
                      }}
                    >
                      #{item.SampleId}
                    </Text>
                  </Text>

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      padding: 10,
                      marginRight: 10,
                      height: 40,

                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        marginLeft: 10,
                        width: 90,

                        color: getTextColor(item.PaymentTYpe),
                      }}
                    >
                      {item.PaymentTYpe} Sales
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.touchableOpacityText,
                    {
                      alignSelf: "flex-start",
                      marginLeft: 10,
                      color: "grey",
                      fontSize: 12,
                      marginTop: 10,
                    },
                  ]}
                >
                  Req: {item.Requestor}
                </Text>
                <Text
                  style={[
                    styles.touchableOpacityText,
                    {
                      alignSelf: "flex-end",
                      marginRight: 10,
                      fontWeight: "bold",
                      color: "#006633",
                    },
                  ]}
                >
                  Rs.{item.TotalPrice}
                </Text>

                <Text
                  style={[
                    styles.touchableOpacityText,
                    {
                      fontSize: 12,
                      alignSelf: "flex-end",
                      marginRight: 10,
                      color: "grey",
                    },
                  ]}
                >
                  {formatDate(item.CreatedOn)} {item.CreatedOnNepaliDate}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        {/* Modal to show entire data */}

        <Modal
          isVisible={isModalVisible}
          onBackdropPress={closeModal}
          onBackButtonPress={closeModal}
        >
          <View style={styles.modalContainer}>
            {/* Render the selectedData in the modal */}
            {selectedData &&
              Object.entries(selectedData).map(([key, value]) => (
                <View key={key} style={styles.modalRow}>
                  <Text style={styles.modalKey}>{key}</Text>
                  <Text style={styles.modalValue}>{value}</Text>
                </View>
              ))}
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  filterContainer: {
    flexDirection: "column",
    marginBottom: 10,
    flex: 1,
    width: 320,
  },
  button: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#C1C0B9",
    backgroundColor: "white",
    width: "100%",
  },

  applyButton: {
    backgroundColor: "#047bc2",
    width: 115,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "black",
  },
  pickerModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  filterItem: {
    flex: 1,
    marginRight: 5,
  },
  touchableOpacity: {
    height: 110,
    backgroundColor: "#FAFAFB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  touchableOpacityText: {
    color: "black",
  },

  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modalKey: {
    fontWeight: "bold",
  },
  modalValue: {
    flex: 1,
    textAlign: "right",
  },
  overviewContainer: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  toggleButton: {
    marginTop: 10,
    marginRight: 10,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  overviewText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
  },
  overviewTextButton: {
    color: "grey",
  },
});

export default CashSales;
