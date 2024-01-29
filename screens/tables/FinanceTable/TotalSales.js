import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Table, Row } from "react-native-table-component";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import theme from "../../../theme";
import Icon from "react-native-vector-icons/Feather";
import { makeApiRequest, apiEndpoints } from "../../../services/constants/url";
``;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const TotalSales = (route) => {
  // State to manage filters
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [requestorFilter, setRequestorFilter] = useState("");
  // State to store filtered data for the table
  const [filteredData, setFilteredData] = useState([]);

  const { state } = route.navigation;

  // State for dynamic columns from the backend
  const [columns, setColumns] = useState([]);

  // State to manage datetime picker visibility
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState("");

  // State to manage modal visibility for Pickers
  const [isRequestorPickerVisible, setRequestorPickerVisibility] =
    useState(false);

  // Requestor list options
  const [requestorList, setRequestorList] = useState([]);

  const [isDataVisible, setDataVisibility] = useState(false);

  // Explabalde tablerows
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);
  const toggleExpand = (index) => {
    setExpandedRowIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const applyFilters = async () => {
    try {
      const response = await makeApiRequest(
        apiEndpoints.getRequestorwiseTotalSalesSummaryByDate,
        {
          from: fromDate,
          to: toDate,
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

  // Toggle requestor picker visibility
  const toggleRequestorPicker = () => {
    setRequestorPickerVisibility(!isRequestorPickerVisible);
  };

  useEffect(() => {
    // Fetch requestor list
    const fetchRequestorList = async () => {
      try {
        const requestorListResponse = await makeApiRequest(
          apiEndpoints.getRequestorList
        );
        // console.log("Requestor List:", requestorListResponse);

        // Extract the array of requestors from the response
        const requestors = requestorListResponse["ReportType"] || [];

        // Update requestor list options
        setRequestorList(requestors);
      } catch (error) {
        console.error("Error fetching requestor list:", error);
      }
    };

    fetchRequestorList();
  }, []);
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
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Filters */}
        <ScrollView horizontal={true}>
          <View style={styles.filterContainer}>
            {/* First Row of Filters */}
            <View style={styles.filterItem}>
              <TouchableOpacity
                onPress={() => toggleDatePicker("fromDate")}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  From Date: {fromDate ? fromDate.split("T")[0] : "Select Date"}
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

            <TouchableOpacity
              onPress={applyFilters}
              style={[styles.button, styles.applyButton]}
            >
              <Text style={styles.buttonTexts}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* Date Time Picker */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDatePickerChange}
          onCancel={() => setDatePickerVisibility(false)}
        />
        {/* Table */}
        {/* Replace Table with TouchableOpacity Components */}
        {isDataVisible && (
          <ScrollView>
            {filteredData.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleTouchableOpacityPress(item)}
                style={styles.touchableOpacity}
              >
                <Text
                  style={[
                    styles.touchableOpacityText,
                    {
                      alignSelf: "flex-start",
                      fontWeight: "bold",
                      color: "grey",
                      marginLeft: 10,
                    },
                  ]}
                >
                  {item.Requestor}
                </Text>
                <Text
                  style={[
                    styles.touchableOpacityText,
                    {
                      alignSelf: "flex-end",
                      marginRight: 10,
                      color: "#990000",
                    },
                  ]}
                >
                  Total Price: {item.TotalPrice}
                </Text>
                <Text
                  style={[
                    styles.touchableOpacityText,
                    {
                      alignSelf: "flex-end",
                      marginRight: 10,
                      color: "#daa520",
                    },
                  ]}
                >
                  Discount Total: {item.DiscountTotal}
                </Text>
                <Text
                  style={[
                    styles.touchableOpacityText,
                    {
                      alignSelf: "flex-end",
                      marginRight: 10,
                      color: "#006633",
                    },
                  ]}
                >
                  Actual Total: {item.ActualTotal}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Modal to show entire data */}
        <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
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
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#C1C0B9",
    backgroundColor: "white",
    width: 320,
  },
  applyButton: {
    backgroundColor: "#047bc2",
    width: 115,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "black",
  },
  buttonTexts: {
    color: "#fff",
  },
  header: { height: 50, backgroundColor: theme.primaryColor },
  row: { height: 40, backgroundColor: "#F1F8FF" },
  text: { textAlign: "center" },
  headerText: { textAlign: "center", fontWeight: "600", color: "white" },
  pickerModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  filterItem: {
    flex: 1,
    marginRight: 5,
  },

  touchableOpacity: {
    height: 110,
    backgroundColor: "#F1F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  touchableOpacityText: {
    textAlign: "center",
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
});

export default TotalSales;
