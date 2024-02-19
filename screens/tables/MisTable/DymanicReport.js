import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Table, Row } from "react-native-table-component";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import theme from "../../../theme";
import Icon from "react-native-vector-icons/Feather";
import { ActivityIndicator } from "react-native-paper";
import ExportToPDFButton from "../../../components/ExportToPDFButton";
import { makeApiRequest, apiEndpoints } from "../../../services/constants/url";

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const DynamicReport = (route) => {
  const [isLoading, setLoading] = useState(false);
  // State to manage filters
  const [fromDate, setFromDate] = useState(new Date().toISOString());
  const [toDate, setToDate] = useState(new Date().toISOString());
  const [requestorFilter, setRequestorFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  // State to store filtered data for the table
  const [filteredData, setFilteredData] = useState([]);

  const { state } = route.navigation;

  // State for dynamic columns from the backend
  const [columns, setColumns] = useState([]);

  // State to manage datetime picker visibility
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState("");

  // State to manage modal visibility for Pickers
  const [isGenderPickerVisible, setGenderPickerVisibility] = useState(false);
  const [isRequestorPickerVisible, setRequestorPickerVisibility] =
    useState(false);

  // Requestor list options
  const [requestorList, setRequestorList] = useState([]);

  const [isTableVisible, setTableVisibility] = useState(false);

  // Explabalde tablerows
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);
  const toggleExpand = (index) => {
    setExpandedRowIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // Apply filters and update filteredData
  const applyFilters = async () => {
    try {
      setLoading(true); // Set loading to true when starting data fetch

      const response = await makeApiRequest(
        apiEndpoints.GetDatewiseReferredDoctorTransactionDetails,
        {
          from: fromDate,
          to: toDate,
          refId: requestorFilter.RId || 0,
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

  // Toggle requestor picker visibility
  const toggleRequestorPicker = () => {
    setRequestorPickerVisibility(!isRequestorPickerVisible);
  };

  useEffect(() => {
    // Fetch requestor list
    const fetchRequestorList = async () => {
      try {
        const requestorListResponse = await makeApiRequest(
          apiEndpoints.GetListOfReportType
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
  }, []); // Empty dependency array ensures the effect runs only once on mount
  const [expandedRows, setExpandedRows] = useState([]);

  // Handle row press to expand or collapse
  const handleRowPress = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    // Toggle the state of the pressed row
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(index)
        ? prevExpandedRows.filter((rowIndex) => rowIndex !== index)
        : [...prevExpandedRows, index]
    );
  };

  const [isDataVisible, setDataVisibility] = useState(false);
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
  const [isModalVisible, setModalVisible] = useState(false);
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Toggle Filters */}
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
                    {`Report Type: ${
                      requestorFilter.ReportType || "Select Report"
                    }`}
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
              pageTitle="Dymanic Report"
              reportType="Dynamic Report"
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
              <Picker.Item label="Select Doctor" value="" />
              {requestorList.map((requestor) => (
                <Picker.Item
                  key={requestor.RId}
                  label={requestor.ReportType}
                  value={requestor}
                />
              ))}
            </Picker>
          </View>
        </Modal>

        {/* Table */}
        {isDataVisible && (
          <ScrollView>
            {filteredData.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleTouchableOpacityPress(item)}
                style={styles.touchableOpacity}
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
                    {item["Patient Name"]}
                    <Text
                      style={[
                        styles.touchableOpacityText,
                        {
                          alignSelf: "flex-end",
                          marginLeft: 10,
                          fontWeight: "300",
                        },
                      ]}
                    >
                      #{item.BillNo}
                    </Text>
                  </Text>
                </View>

                <Text
                  style={[
                    styles.touchableOpacityText,
                    {
                      alignSelf: "flex-start",
                      marginLeft: 10,
                    },
                  ]}
                >
                  Referer: {item["Refer Name"]}
                </Text>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={[
                    styles.touchableOpacityText,
                    {
                      marginLeft: 10,
                      alignSelf: "flex-start",
                    },
                  ]}
                >
                  Test: {item.Test}
                </Text>
                <Text
                  style={[
                    styles.touchableOpacityText,
                    {
                      alignSelf: "flex-end",
                      marginRight: 10,
                      fontWeight: "500",
                    },
                  ]}
                >
                  Rs.{item.Price}
                </Text>
                <Text
                  style={[
                    styles.touchableOpacityText,
                    {
                      alignSelf: "flex-end",
                      marginRight: 10,
                      color: "grey",
                    },
                  ]}
                >
                  {item.Date}
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
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "black",
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
    height: 140,
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
  overviewText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
  },
  overviewTextButton: {
    color: "grey",
  },
});

export default DynamicReport;
