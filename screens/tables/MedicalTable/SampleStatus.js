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
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Table, Row } from "react-native-table-component";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import theme from "../../../theme";
import Icon from "react-native-vector-icons/Feather";
import { makeApiRequest, apiEndpoints } from "../../../services/constants/url";
import { ActivityIndicator, TextInput } from "react-native-paper";
import ExportToPDFButton from "../../../components/ExportToPDFButton";

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const SampleStatus = ({ navigation, route }) => {
  console.log(navigation);
  const key = route.params;
  console.log("Key:", key);

  const handlePress = () => {
    navigation.navigate("NormalReport");
  };

  const [isLoading, setLoading] = useState(false);
  // State to manage filters
  const [fromDate, setFromDate] = useState(new Date().toISOString());
  const [toDate, setToDate] = useState(new Date().toISOString());
  const [requestorFilter, setRequestorFilter] = useState("");
  const [refererFilter, setRefererFilter] = useState("");
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
  const [isRefererPickerVisible, setRefererPickerVisibility] = useState(false);

  // Requestor list options
  const [requestorList, setRequestorList] = useState([]);
  const [refererList, setRefererList] = useState([]);
  const [fiscalYearList, setFiscalYearList] = useState([]);
  const [selectedFiscalYearFilter, setSelectedFiscalYearFilter] = useState("");

  const [diagnosisFilter, setDiagnosisFilter] = useState("");
  const [diagnosisList, setDiagnosisList] = useState([]);

  const [isDataVisible, setDataVisibility] = useState(false);

  const toggleRefererPicker = () => {
    setRefererPickerVisibility(!isRefererPickerVisible);
  };

  const applyFilters = async () => {
    try {
      setLoading(true); // Set loading to true when starting data fetch
      console.log("Key:", key);
      const response = await makeApiRequest(
        apiEndpoints.GetReportStatusDetailsWithDateAndFilter,
        {
          fromdate: fromDate,
          todate: toDate,
          samplestatus: key || 0,
          requestorid: requestorFilter.Id ? requestorFilter.Id : 0,
          referid: refererFilter.Id || 0,
          diagnosisGroupId: diagnosisFilter.Id || 0,
          sampleId: textInputValue || 0,
          fiscalyearId: selectedFiscalYearFilter.Id || 6,
          reporttype: reportTypeFilter.value || 0,
        }
      );

      // Function to remove HTML tags using regular expressions
      const removeHtmlTags = (htmlString) => {
        if (typeof htmlString !== "string") {
          return htmlString; // If not a string, return as is
        }
        return htmlString.replace(/<[^>]*>?/gm, ""); // Remove HTML tags
      };

      // Extract the array of data from the response and remove HTML tags
      const data = (response["ReportStatus"] || []).map((item) => {
        const cleanedItem = {};
        for (const key in item) {
          cleanedItem[key] = removeHtmlTags(item[key]);
        }
        return cleanedItem;
      });

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

  useEffect(() => {
    // Fetch referer list
    const fetchRefererList = async () => {
      try {
        const refererListResponse = await makeApiRequest(
          apiEndpoints.GetReferedDoctorList
        );
        // console.log(refererListResponse["ReportType"]);
        // Extract the array of referers from the response
        const referers = refererListResponse["ReportType"] || [];

        // Update referer list options
        setRefererList(referers);
      } catch (error) {
        console.error("Error fetching referer list:", error);
      }
    };

    fetchRefererList();
  }, []);

  useEffect(() => {
    const fetchDiagnosisList = async () => {
      try {
        const diagnosisListResponse = await makeApiRequest(
          apiEndpoints.GetDiagnosiGroupList
        );
        // console.log(diagnosisListResponse);
        // Extract the array of diagnoses from the response
        const diagnoses = diagnosisListResponse["DiagnosisGroup"] || [];

        // Update diagnosis list options
        setDiagnosisList(diagnoses);
      } catch (error) {
        console.error("Error fetching diagnosis list:", error);
      }
    };

    fetchDiagnosisList();
  }, []);
  useEffect(() => {
    const fetchFiscalYearList = async () => {
      try {
        const fiscalYearListResponse = await makeApiRequest(
          apiEndpoints.GetFiscalYearCodeList
        );

        // Extract the array of fiscal years from the response
        const fiscalYears = fiscalYearListResponse["FIscalYearCode"] || [];

        // Update fiscal year list options
        setFiscalYearList(fiscalYears);
      } catch (error) {
        console.error("Error fetching fiscal year list:", error);
      }
    };

    fetchFiscalYearList();
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

  const [isDiagnosisPickerVisible, setDiagnosisPickerVisibility] =
    useState(false);

  // Add function to toggle Diagnosis Picker visibility
  const toggleDiagnosisPicker = () => {
    setDiagnosisPickerVisibility(!isDiagnosisPickerVisible);
  };
  const [isFiscalYearPickerVisible, setFiscalYearPickerVisibility] =
    useState(false);

  const toggleFiscalYearPicker = () => {
    setFiscalYearPickerVisibility(!isFiscalYearPickerVisible);
  };
  // State for Report Type Filter
  const [isReportTypePickerVisible, setReportTypePickerVisibility] =
    useState(false);
  const [reportTypeFilter, setReportTypeFilter] = useState("");

  // Function to toggle Report Type Picker visibility
  const toggleReportTypePicker = () => {
    setReportTypePickerVisibility(!isReportTypePickerVisible);
  };
  const reportTypeOptions = [
    { name: "Select Type" },
    { name: "Normal Report", value: 1 },
    { name: "Histo Report", value: 2 },
  ];
  const [textInputValue, setTextInputValue] = useState("");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }} // Make sure the KeyboardAvoidingView takes up the entire screen
      behavior={Platform.OS === "ios" ? "padding" : null} // Adjust behavior for iOS or leave it null for Android
    >
      <ScrollView>
        <View style={styles.container}>
          {/* Toggle Overview and Filters */}
          <View style={styles.overviewContainer}>
            <Text style={styles.overviewText}>Overview</Text>
            <TouchableOpacity
              onPress={toggleFilters}
              style={styles.toggleButton}
            >
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
                      onPress={() => toggleFiscalYearPicker()}
                      style={[styles.button]}
                    >
                      <Text style={styles.buttonText}>
                        {`Fiscal Year: ${
                          selectedFiscalYearFilter.Year || "2080/81"
                        }`}
                      </Text>
                    </TouchableOpacity>
                  </View>
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
                        {`Requestor: ${
                          requestorFilter.Requestor || "Select All"
                        }`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.filterItem}>
                    <TouchableOpacity
                      onPress={() => toggleRefererPicker()}
                      style={[styles.button]}
                    >
                      <Text style={styles.buttonText}>
                        {`Select Referer: ${
                          refererFilter.Name || "Select All"
                        }`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.filterItem}>
                    <TouchableOpacity
                      onPress={() => toggleDiagnosisPicker()}
                      style={[styles.button]}
                    >
                      <Text style={styles.buttonText}>
                        {`Diagnosis: ${
                          diagnosisFilter.Diagnosis || "Select All"
                        }`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.filterItem}>
                    <TouchableOpacity
                      onPress={toggleReportTypePicker}
                      style={styles.button}
                    >
                      <Text style={styles.buttonText}>
                        {`Report : ${reportTypeFilter.name || "Select All"}`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.filterItem}>
                    <TouchableOpacity onPress={() => {}} style={styles.button}>
                      <Text>Sample Id: </Text>
                      <TextInput
                        placeholder="Enter Sample Id"
                        value={textInputValue}
                        onChangeText={setTextInputValue}
                        onFocus={() => {}}
                        placeholderTextColor="#888" // Set the placeholder text color
                        underlineColorAndroid="transparent" // Hide the underline
                        underlineColoriOS="transparent" // Hide the underline
                        style={{ backgroundColor: "#fff", height: 20 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
          {isDataVisible &&
            (isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ExportToPDFButton
                tableData={filteredData}
                pageTitle="Sample Details"
                reportType="Sample Details Report"
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
                    label={requestor.Requestor}
                    value={requestor}
                  />
                ))}
              </Picker>
            </View>
          </Modal>
          <Modal
            isVisible={isRefererPickerVisible}
            onBackdropPress={toggleRefererPicker}
          >
            <View style={styles.pickerModal}>
              <Picker
                selectedValue={refererFilter}
                onValueChange={(itemValue) => {
                  setRefererFilter(itemValue);
                  toggleRefererPicker();
                }}
              >
                <Picker.Item label="Select Referer" value="" />
                {refererList.map((referer) => (
                  <Picker.Item
                    key={referer.Id}
                    label={referer.Name}
                    value={referer}
                  />
                ))}
              </Picker>
            </View>
          </Modal>
          <Modal
            isVisible={isDiagnosisPickerVisible}
            onBackdropPress={toggleDiagnosisPicker}
          >
            <View style={styles.pickerModal}>
              <Picker
                selectedValue={diagnosisFilter}
                onValueChange={(itemValue) => {
                  setDiagnosisFilter(itemValue);
                  toggleDiagnosisPicker();
                }}
              >
                <Picker.Item label="Select Diagnosis" value="" />
                {diagnosisList.map((diagnosis) => (
                  <Picker.Item
                    key={diagnosis.Id}
                    label={diagnosis.Diagnosis}
                    value={diagnosis}
                  />
                ))}
              </Picker>
            </View>
          </Modal>

          <Modal
            isVisible={isFiscalYearPickerVisible}
            onBackdropPress={toggleFiscalYearPicker}
          >
            <View style={styles.pickerModal}>
              <Picker
                selectedValue={selectedFiscalYearFilter}
                onValueChange={(itemValue) => {
                  setSelectedFiscalYearFilter(itemValue);
                  toggleFiscalYearPicker();
                }}
              >
                <Picker.Item label="Select Fiscal Year" value="" />
                {fiscalYearList.map((fiscalYear) => (
                  <Picker.Item
                    key={fiscalYear.Id}
                    label={fiscalYear.Year}
                    value={fiscalYear}
                  />
                ))}
              </Picker>
            </View>
          </Modal>

          {/* Modal for Report Type Picker */}
          <Modal
            isVisible={isReportTypePickerVisible}
            onBackdropPress={toggleReportTypePicker}
          >
            <View style={styles.pickerModal}>
              <Picker
                selectedValue={reportTypeFilter}
                onValueChange={(itemValue) => {
                  setReportTypeFilter(itemValue);
                  toggleReportTypePicker();
                }}
              >
                {reportTypeOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.name}
                    value={option}
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
                  onPress={() =>
                    navigation.navigate("NormalReport", item.SampleId, {
                      selectedFiscalYearFilter,
                    })
                  }
                  style={styles.touchableOpacity}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
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
                      {item.PatientDetails}
                    </Text>

                    <TouchableOpacity
                      style={{
                        flex: 1,
                        padding: 10,
                      }}
                    >
                      <Text
                        style={{
                          alignSelf: "center",
                        }}
                      >
                        {item.Status}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[
                      styles.touchableOpacityText,
                      {
                        alignSelf: "flex-start",
                        marginRight: 10,
                        marginLeft: 10,
                        top: 20,
                      },
                    ]}
                  >
                    Requestor/Referer: {item["Requestor/Referrer"]}
                  </Text>

                  <Text
                    style={[
                      styles.touchableOpacityText,
                      {
                        alignSelf: "flex-end",
                        marginRight: 10,
                        color: "grey",
                        marginTop: 30,
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
    </KeyboardAvoidingView>
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
    height: 150,
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

export default SampleStatus;
