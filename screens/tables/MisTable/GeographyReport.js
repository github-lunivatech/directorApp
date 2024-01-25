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

const GerographyReport = (route) => {
  // State to manage filters
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [requestorFilter, setRequestorFilter] = useState("");

  // State to store filtered data for the table
  const [filteredData, setFilteredData] = useState([]);
  const [stateFilter, setStateFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [municipalityFilter, setMunicipalityFilter] = useState("");
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [municipalityList, setMunicipalityList] = useState([]);

  // State for dynamic columns from the backend
  const [columns, setColumns] = useState([]);

  // State to manage datetime picker visibility
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState("");

  // State to manage modal visibility for Pickers
  const [isGenderPickerVisible, setGenderPickerVisibility] = useState(false);
  const [isRequestorPickerVisible, setRequestorPickerVisibility] =
    useState(false);

  const [isStatePickerVisible, setStatePickerVisibility] = useState(false);
  const [isDistrictPickerVisible, setDistrictPickerVisibility] =
    useState(false);
  const [isMunicipalityPickerVisible, setMunicipalityPickerVisibility] =
    useState(false);
  // Requestor list options
  const [requestorList, setRequestorList] = useState([]);

  const [isTableVisible, setTableVisibility] = useState(false);

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
          apiEndpoints.GetDatametricReportType
        );
        // console.log("Requestor List:", requestorListResponse);

        // Extract the array of requestors from the response

        const requestors = requestorListResponse.ReportDetails;

        // Update requestor list options
        setRequestorList(requestors);
      } catch (error) {
        console.error("Error fetching requestor list:", error);
      }
    };

    fetchRequestorList();
  }, []);
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

  useEffect(() => {
    const fetchStateList = async () => {
      try {
        const stateListResponse = await makeApiRequest(apiEndpoints.GetStates);
        const states = stateListResponse["StateDetails"] || [];
        setStateList(states);
        console.log(stateFilter, "This is the response");
      } catch (error) {
        console.error("Error fetching state list:", error);
      }
    };
    fetchStateList();
  }, []);

  useEffect(() => {
    console.log("This is district");
    const fetchDistrictList = async () => {
      if (stateFilter) {
        try {
          const districtListResponse = await makeApiRequest(
            apiEndpoints.GetDistrictsByStateId,

            { stateId: stateFilter }
          );
          console.log(districtListResponse);
          const districts = districtListResponse.DistrictList;
          console.log(districts, "This response");
          setDistrictList(districts);
        } catch (error) {
          console.error("Error fetching district list:", error);
        }
      }
    };

    fetchDistrictList();
  }, [stateFilter]);

  useEffect(() => {
    const fetchMunicipalityList = async () => {
      if (districtFilter) {
        try {
          const municipalityListResponse = await makeApiRequest(
            apiEndpoints.GetMunicipalitiesByDistrictId,
            { districtId: districtFilter }
          );
          const municipalities = municipalityListResponse.MunicipalList;
          setMunicipalityList(municipalities);
        } catch (error) {
          console.error("Error fetching municipality list:", error);
        }
      }
    };

    fetchMunicipalityList();
  }, [districtFilter]);

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
            <View style={styles.filterItem}>
              <TouchableOpacity
                onPress={() => setStatePickerVisibility(true)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {`State: ${stateFilter || "Select State"}`}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.filterItem}>
              <TouchableOpacity
                onPress={() => setDistrictPickerVisibility(true)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {`District: ${districtFilter || "Select District"}`}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.filterItem}>
              <TouchableOpacity
                onPress={() => setMunicipalityPickerVisibility(true)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {`Municipality: ${
                    municipalityFilter || "Select Municipality"
                  }`}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.filterItem}>
              <TouchableOpacity
                onPress={() => toggleRequestorPicker()}
                style={[styles.button]}
              >
                <Text style={styles.buttonText}>
                  {`Requestor: ${requestorFilter || "Select Datamertic"}`}
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
                  key={requestor.RId}
                  label={requestor.ReportName}
                  value={requestor.RId}
                />
              ))}
            </Picker>
          </View>
        </Modal>
        <Modal
          isVisible={isStatePickerVisible}
          onBackdropPress={() => setStatePickerVisibility(false)}
        >
          <View style={styles.pickerModal}>
            <Picker
              selectedValue={stateFilter}
              onValueChange={(itemValue) => {
                setStateFilter(itemValue);
                setStatePickerVisibility(false);
              }}
            >
              <Picker.Item label="Select State" value="" />
              {stateList.map((state) => (
                <Picker.Item
                  key={state.Id}
                  label={state.Name}
                  value={state.Id}
                />
              ))}
            </Picker>
          </View>
        </Modal>

        {/* District Picker Modal */}
        <Modal
          isVisible={isDistrictPickerVisible}
          onBackdropPress={() => setDistrictPickerVisibility(false)}
        >
          <View style={styles.pickerModal}>
            <Picker
              selectedValue={districtFilter}
              onValueChange={(itemValue) => {
                setDistrictFilter(itemValue);
                setDistrictPickerVisibility(false);
              }}
            >
              <Picker.Item label="Select District" value="" />
              {districtList.map((district) => (
                <Picker.Item
                  key={district.Id}
                  label={district.Name}
                  value={district.Id}
                />
              ))}
            </Picker>
          </View>
        </Modal>

        {/* Municipality Picker Modal */}
        <Modal
          isVisible={isMunicipalityPickerVisible}
          onBackdropPress={() => setMunicipalityPickerVisibility(false)}
        >
          <View style={styles.pickerModal}>
            <Picker
              selectedValue={municipalityFilter}
              onValueChange={(itemValue) => {
                setMunicipalityFilter(itemValue);
                setMunicipalityPickerVisibility(false);
              }}
            >
              <Picker.Item label="Select Municipality" value="" />
              {municipalityList.map((municipality) => (
                <Picker.Item
                  key={municipality.Id}
                  label={municipality.Name}
                  value={municipality.Id}
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
                  <TouchableOpacity onPress={() => toggleExpand(index)}>
                    <Row
                      data={columns.map((column) => item[column.key])}
                      style={styles.row}
                      textStyle={styles.text} // Update this line
                      widthArr={columns.map(() => 160)} // Set a fixed width for each visible column
                    />
                  </TouchableOpacity>
                  {expandedRowIndex === index && (
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
                  )}
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

export default GerographyReport;
