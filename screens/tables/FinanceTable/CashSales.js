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

import { makeApiRequest, apiEndpoints } from "../../../services/constants/url";

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const CashSales = (route) => {
  // State to manage filters
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [genderFilter, setGenderFilter] = useState("");
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
  // const applyFilters = async () => {
  //   try {
  //     const response = await makeApiRequest(
  //       apiEndpoints.getDatewiseRequestorTransactionDetails,
  //       {
  //         from: fromDate,
  //         to: toDate,
  //         reqId: requestorFilter,
  //       }
  //     );
  //     console.log(fromDate, "This is the date");
  //     console.log("API Response:", response);

  //     // Extract the array of data from the response
  //     const data = response["ReportDetails"] || [];

  //     // Use the keys of the first item as columns
  //     const keys = Object.keys(data[0] || {});
  //     const newColumns = keys.map((key) => ({ key, label: key }));

  //     // Set columns and filteredData
  //     setColumns(newColumns);
  //     setFilteredData(data);
  //     setTableVisibility(true);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
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
      setTableVisibility(true);
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

  // Toggle gender picker visibility
  const toggleGenderPicker = () => {
    setGenderPickerVisibility(!isGenderPickerVisible);
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

            {/* Second Row of Filters */}
            {/* <View style={styles.filterItem}>
                <TouchableOpacity
                  onPress={toggleGenderPicker}
                  style={[styles.button]}
                >
                  <Text style={styles.buttonText}>
                    {`Gender: ${genderFilter || "Select Gender"}`}
                  </Text>
                </TouchableOpacity>
              </View> */}
            <View style={styles.filterItem}>
              <TouchableOpacity
                onPress={() => toggleRequestorPicker()}
                style={[styles.button]}
              >
                <Text style={styles.buttonText}>
                  {`Requestor: ${requestorFilter || "Select Requestor"}`}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={applyFilters}
              style={[styles.button, styles.applyButton]}
            >
              <Text style={styles.buttonText}>Apply Filters</Text>
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
        {/* Gender Picker Modal */}
        <Modal
          isVisible={isGenderPickerVisible}
          onBackdropPress={toggleGenderPicker}
        >
          <View style={styles.pickerModal}>
            <Picker
              selectedValue={genderFilter}
              onValueChange={(itemValue) => {
                setGenderFilter(itemValue);
                toggleGenderPicker();
              }}
            >
              <Picker.Item label="All Genders" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          </View>
        </Modal>

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
                  label={requestor.Requestor}
                  value={requestor.Id}
                />
              ))}
            </Picker>
          </View>
        </Modal>

        {/* Table */}

        {isTableVisible && (
          <ScrollView horizontal>
            <Table borderStyle={{ borderColor: "black" }}>
              <Row
                data={columns.map((column) => column.label)}
                style={styles.header}
                textStyle={styles.headerText} // Update this line
                widthArr={columns.map(() => 160)} // Set a fixed width for each visible column
              />
              {filteredData.map((item, index) => (
                <React.Fragment key={index}>
                  {/* <TouchableOpacity onPress={() => toggleExpand(index)}> */}
                  <Row
                    data={columns.map((column) => item[column.key])}
                    style={styles.row}
                    textStyle={styles.text} // Update this line
                    widthArr={columns.map(() => 160)} // Set a fixed width for each visible column
                  />
                  {/* </TouchableOpacity> */}
                  {/* {expandedRowIndex === index && (
            <View>
              {columns.slice(2).map((column) => (
                <Row
                  key={column.key}
                  data={[column.label, item[column.key]]}
                  style={styles.expandedRow}
                  textStyle={styles.text} // Update this line
                  widthArr={[160, 160]} // Set a fixed width for the expanded columns
                />
              ))}
            </View>
          )} */}
                </React.Fragment>
              ))}
            </Table>
          </ScrollView>
        )}
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
  expandedRow: {
    height: 60, // Adjust the height as needed
    backgroundColor: "#F1F8FF",
  },
});

export default CashSales;
