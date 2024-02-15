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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Table, Row } from "react-native-table-component";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import theme from "../../../theme";
import Icon from "react-native-vector-icons/Feather";
import { makeApiRequest, apiEndpoints } from "../../../services/constants/url";
import { ActivityIndicator } from "react-native-paper";
import ExportToPDFButton from "../../../components/ExportToPDFButton";

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const TotalSales = (route) => {
  const [isLoading, setLoading] = useState(false);

  // State to manage filters
  const [fromDate, setFromDate] = useState(new Date().toISOString());
  const [toDate, setToDate] = useState(new Date().toISOString());
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
      setLoading(true); // Set loading to true when starting data fetch
      const response = await makeApiRequest(
        apiEndpoints.GetDailySummaryTransactionUserWiseByDate,
        {
          from: fromDate,
          to: toDate,
          userId: requestorFilter.Id || 0,
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

  // Toggle requestor picker visibility
  const toggleRequestorPicker = () => {
    setRequestorPickerVisibility(!isRequestorPickerVisible);
  };

  useEffect(() => {
    // Fetch requestor list
    const fetchRequestorList = async () => {
      try {
        const requestorListResponse = await makeApiRequest(
          apiEndpoints.GetListOfUserForMetric
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

  const [areFiltersVisible, setFiltersVisibility] = useState(false);

  const toggleFilters = () => {
    setFiltersVisibility(!areFiltersVisible);
  };

  const getBackgroundColor = (paymentType) => {
    switch (paymentType) {
      case "Cash":
        return "#F5FFF9";
      case "Credit":
        return "#FFE6E6";
      case "CreditCollection":
        return "#F5FFF9";
      case "DueCollection":
        return "#F5FFF9";
      case "Due":
        return "#FFE6E6";
      case "Card":
        return "#F5FFF9";
      case "Bank":
        return "#F5FFF9";
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
        return "#3DD598";
      case "DueCollection":
        return "#3DD598";
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
  const handleBackButton = () => {
    if (isModalVisible) {
      closeModal(); // Close the modal when the back button is pressed
      return true; // Prevent default behavior
    }
    return false;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );
    return () => backHandler.remove();
  }, [isModalVisible]);

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
                <View style={styles.filterItem}>
                  <TouchableOpacity
                    onPress={() => toggleRequestorPicker()}
                    style={[styles.button]}
                  >
                    <Text style={styles.buttonText}>
                      {`User: ${requestorFilter.usrFullName || "Select User"}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
        {/* Export button */}

        {isDataVisible &&
          (isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <ExportToPDFButton
              tableData={filteredData}
              pageTitle="Total Sales Report"
              reportType="Total Sales"
            />
          ))}

        <TouchableOpacity
          onPress={applyFilters}
          style={[styles.button, styles.applyButton, { alignSelf: "flex-end" }]}
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
        {/* Date Time Picker */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDatePickerChange}
          onCancel={() => setDatePickerVisibility(false)}
        />

        {/* Requestor Picker Modal */}
        <Modal
          isVisible={isRequestorPickerVisible}
          onBackdropPress={toggleRequestorPicker}
        >
          <View style={styles.pickerModal}>
            <Picker
              selectedValue={requestorFilter}
              onValueChange={(itemValue) => {
                setRequestorFilter(itemValue);
                toggleRequestorPicker();
              }}
            >
              <Picker.Item label="Select Requestor" value="" />
              {requestorList.map((requestor) => (
                <Picker.Item
                  key={requestor.Id}
                  label={requestor.usrFullName}
                  value={requestor}
                />
              ))}
            </Picker>
          </View>
        </Modal>

        {/* Replace Table with TouchableOpacity Components */}
        {isDataVisible && (
          <ScrollView>
            {filteredData.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleTouchableOpacityPress(item)}
                style={[
                  styles.touchableOpacity,
                  {
                    backgroundColor: getBackgroundColor(item.PaymentType),
                  },
                ]}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={[
                      styles.touchableOpacityText,
                      {
                        fontWeight: "bold",
                        fontSize: 13,
                        color: "#000",
                        marginTop: 10,
                        flex: 1,
                        marginRight: 0,
                        alignSelf: "flex-start",
                        marginLeft: 10,
                      },
                    ]}
                  >
                    {item.UserName}
                  </Text>

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      padding: 10,
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        alignSelf: "center",

                        color: getTextColor(item.PaymentType),
                      }}
                    >
                      {item.PaymentType}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text
                  style={[
                    styles.touchableOpacityText,
                    {
                      alignSelf: "flex-end",
                      marginRight: 10,
                    },
                  ]}
                >
                  Total Sales: Rs.{item.TotalSales}
                </Text>
                <Text
                  style={[
                    styles.touchableOpacityText,
                    {
                      alignSelf: "flex-end",
                      marginRight: 10,
                    },
                  ]}
                >
                  Collection: Rs.{item.Collection}
                </Text>
                <Text
                  style={[
                    styles.touchableOpacityText,
                    {
                      alignSelf: "flex-end",
                      marginRight: 10,
                    },
                  ]}
                >
                  Remaining Amount: Rs.{item.Remaining}
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
    alignSelf: "flex-end",
  },
  buttonText: {
    color: "black",
  },
  buttonTexts: {
    color: "#fff",
  },

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

export default TotalSales;
