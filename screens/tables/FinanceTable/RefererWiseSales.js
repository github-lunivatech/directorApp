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

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const RefererWiseSales = () => {
  // State to manage filters
  const [fromDate, setFromDate] = useState(new Date().toISOString());
  const [toDate, setToDate] = useState(new Date().toISOString());
  const [requestorFilter, setRequestorFilter] = useState("");
  // State to store filtered data for the table
  const [filteredData, setFilteredData] = useState([]);

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

  // Apply filters and update filteredData
  const applyFilters = async () => {
    try {
      const response = await makeApiRequest(
        apiEndpoints.GetDatewiseReferredDoctorTransactionDetails,
        {
          from: fromDate,
          to: toDate,
          refId: requestorFilter.Id || 0,
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
          apiEndpoints.GetReferedDoctorList
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
                      {`Referer: ${requestorFilter.Name || "Select Doctor"}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}
          <TouchableOpacity
            onPress={applyFilters}
            style={[
              styles.button,
              styles.applyButton,
              { alignSelf: "flex-end" },
            ]}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]}>
              Apply Filters
            </Text>
          </TouchableOpacity>
        </View>
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
                  key={requestor.Id}
                  label={requestor.Name}
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
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={[
                      styles.touchableOpacityText,
                      {
                        flex: 1,
                        alignSelf: "flex-start",
                        marginRight: 40,
                        fontWeight: "bold",
                        color: "grey",
                      },
                    ]}
                  >
                    {item["Patient Name"]}
                  </Text>
                  <Text
                    style={[
                      styles.touchableOpacityText,
                      {
                        flex: 1,
                        alignSelf: "flex-start",
                        justifyContent: "space-between",
                        fontWeight: "bold",
                        color: "grey",
                      },
                    ]}
                  >
                    Test
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={[
                      styles.touchableOpacityText,
                      {
                        alignSelf: "flex-start",
                        flex: 1,
                        color: "grey",
                        marginLeft: 10,
                      },
                    ]}
                  >
                    Requestor Name :
                  </Text>
                  <Text
                    style={[
                      styles.touchableOpacityText,
                      {
                        alignSelf: "flex-start",
                        flex: 1,
                        color: "grey",
                        marginLeft: 10,
                      },
                    ]}
                  >
                    {item["Test"]}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.touchableOpacityText,
                    {
                      alignSelf: "flex-start",

                      color: "grey",
                      marginLeft: 10,
                    },
                  ]}
                >
                  Ref By: {item["Refer Name"]}
                </Text>
                <Text
                  style={[
                    styles.touchableOpacityText,
                    {
                      alignSelf: "flex-end",
                      marginRight: 20,
                      color: "green",
                      fontWeight: "700",
                    },
                  ]}
                >
                  Price: {item.Price}
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

export default RefererWiseSales;
