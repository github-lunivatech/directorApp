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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Feather";
import { ActivityIndicator } from "react-native-paper";
import ExportToPDFButton from "../../../components/ExportToPDFButton";
import { makeApiRequest, apiEndpoints } from "../../../services/constants/url";

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const GerographyReport = (route) => {
  const [isLoading, setLoading] = useState(false);
  // State to manage filters
  const [fromDate, setFromDate] = useState(new Date().toISOString());
  const [toDate, setToDate] = useState(new Date().toISOString());
  const [requestorFilter, setRequestorFilter] = useState("");
  // State to store filtered data for the table

  // State to store filtered data for the table
  const [filteredData, setFilteredData] = useState([]);
  const [stateFilter, setStateFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [municipalityFilter, setMunicipalityFilter] = useState("");
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [municipalityList, setMunicipalityList] = useState([]);
  const [isStatePickerVisible, setStatePickerVisibility] = useState(false);
  const [isDistrictPickerVisible, setDistrictPickerVisibility] =
    useState(false);
  const [isMunicipalityPickerVisible, setMunicipalityPickerVisibility] =
    useState(false);
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

  const applyFilters = async () => {
    try {
      setLoading(true); // Set loading to true when starting data fetch
      const response = await makeApiRequest(
        apiEndpoints.GeographicalTestwisePatientCountReport,
        {
          provinceid: stateFilter.Id || 0,
          districtid: districtFilter.Id || -1,
          municipalityId: municipalityFilter.Id || -1,
          fromdate: fromDate,
          todate: toDate,
          diagnosisId: requestorFilter.Diagnosis || 0,
          testId: 0,
        }
      );
      console.log(fromDate, "This is the date");
      console.log("API Response:", response);

      // Extract the array of data from the response
      const data = response["TestWiseCount"] || [];

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
          apiEndpoints.GetDiagnosiGroupList
        );

        const requestors = requestorListResponse.DiagnosisGroup;

        // Update requestor list options
        setRequestorList(requestors);
      } catch (error) {
        console.error("Error fetching requestor list:", error);
      }
    };

    fetchRequestorList();
  }, []);

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

            { stateId: stateFilter.Id }
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
            { districtId: districtFilter.Id }
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
                  onPress={() => setStatePickerVisibility(true)}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>
                    {`State: ${stateFilter.Name || "Select State"}`}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.filterItem}>
                <TouchableOpacity
                  onPress={() => setDistrictPickerVisibility(true)}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>
                    {`District: ${districtFilter.Name || "Select District"}`}
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
                      municipalityFilter.Name || "Select Municipality"
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
                    {`Diagnosis: ${
                      requestorFilter.Diagnosis || "Select Diagnosis"
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
              pageTitle="Geography Test Wise Report"
              reportType="Geography Test Wise Resport"
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
              <Picker.Item label="Select Diagnosis" value="" />
              {requestorList.map((requestor) => (
                <Picker.Item
                  key={requestor.Id}
                  label={requestor.Diagnosis}
                  value={requestor}
                />
              ))}
            </Picker>
          </View>
        </Modal>
        {/* State Picker */}
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
                <Picker.Item key={state.Id} label={state.Name} value={state} />
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
                  value={district}
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
                  value={municipality}
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
                    {item.TestName}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.touchableOpacityText,
                    {
                      alignSelf: "flex-start",
                      marginRight: 10,
                      marginLeft: 10,
                    },
                  ]}
                >
                  Diagnosis: {item.Diagnosis}
                </Text>
                <Text
                  style={[
                    styles.touchableOpacityText,
                    {
                      marginTop: 10,
                      alignSelf: "flex-end",
                      marginRight: 10,
                      fontWeight: "500",
                    },
                  ]}
                >
                  Province: {item.ProvinceName}
                </Text>
                {item.DistrictName != null && (
                  <Text
                    style={[
                      styles.touchableOpacityText,
                      {
                        fontWeight: "500",
                        alignSelf: "flex-end",
                        marginRight: 10,
                      },
                    ]}
                  >
                    District : {item.DistrictName}
                  </Text>
                )}
                {item.MunicipalityName != null && (
                  <Text
                    style={[
                      styles.touchableOpacityText,
                      {
                        fontWeight: "500",
                        alignSelf: "flex-end",
                        marginRight: 10,
                      },
                    ]}
                  >
                    Municipality : {item.MunicipalityName}
                  </Text>
                )}
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
                  Male Count :{item.Male}
                </Text>
                <Text
                  style={[
                    styles.touchableOpacityText,
                    {
                      alignSelf: "flex-end",
                      marginRight: 10,
                      color: "grey",
                      marginBottom: 10,
                    },
                  ]}
                >
                  Female Count : {item.Female}
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
  overviewText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
  },
  overviewTextButton: {
    color: "grey",
  },
});

export default GerographyReport;
