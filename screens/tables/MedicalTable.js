import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Table, Row } from "react-native-table-component";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import theme from "../../theme";
import {
  makePostApiRequest,
  apiEndpoints,
} from "../../services/constants/urj2";

const MedicalTable = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [selectedId, setSelectedId] = useState(0);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);

  const toggleDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };

  const handleDatePickerChange = (date) => {
    if (date) {
      setFromDate(date);
    }
    setDatePickerVisibility(false);
  };

  const loadTableData = async () => {
    try {
      const formattedFromDate = fromDate.toISOString();
      const formattedToDate = toDate.toISOString();
      console.log(formattedFromDate, "", formattedToDate);
      const data = {
        FromDate: formattedFromDate,
        ToDate: formattedToDate,
        Id: 0,
      };
      const response = await makePostApiRequest(
        apiEndpoints.getTATRecordofTestByDateRange,
        data
      );

      if (response && response.GetTATRecordofTestByDateRange) {
        const reportDetails = response.GetTATRecordofTestByDateRange;
        const firstItem = reportDetails.length > 0 ? reportDetails[0] : {};

        // Use the keys of the first item as columns
        const columnKeys = Object.keys(firstItem);
        const newColumns = columnKeys.map((key) => ({ key, label: key }));

        // Set columns and tableData
        setColumns(newColumns);
        setTableData(reportDetails);
      } else {
        // Handle no data or unexpected response
        setColumns([]);
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // You can initialize columns with some default values if needed
    // setColumns([
    //   { key: "Test", label: "Test" },
    //   { key: "Date", label: "Date" },
    //   { key: "NetAmt", label: "Net Amount" },
    //   // Add more columns as needed
    // ]);
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Date Picker */}
        <TouchableOpacity onPress={toggleDatePicker} style={styles.button}>
          <Text style={styles.buttonText}>
            Select From Date: {fromDate.toISOString().split("T")[0]}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDatePickerChange}
          onCancel={toggleDatePicker}
        />

        {/* To Date Picker */}
        <TouchableOpacity onPress={toggleDatePicker} style={styles.button}>
          <Text style={styles.buttonText}>
            Select To Date: {toDate.toISOString().split("T")[0]}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDatePickerChange}
          onCancel={toggleDatePicker}
        />

        {/* ID Selector */}
        <Text>ID:</Text>
        {/* Add your ID selector component here */}

        {/* Load Button */}
        <TouchableOpacity onPress={loadTableData} style={styles.button}>
          <Text style={styles.buttonText}>Load Data</Text>
        </TouchableOpacity>

        {/* Table */}
        <ScrollView horizontal={true}>
          <Table borderStyle={{ borderWidth: 1.5, borderColor: "black" }}>
            <Row
              data={columns.map((column) => column.label)}
              style={styles.header}
              textStyle={styles.headerText}
              widthArr={columns.map(() => 160)}
            />
            {tableData.map((item, index) => (
              <Row
                key={index}
                data={columns.map((column) => item[column.key])}
                style={styles.row}
                textStyle={styles.text}
                widthArr={columns.map(() => 160)}
              />
            ))}
          </Table>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#C1C0B9",
    backgroundColor: theme.primaryColor,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
  },
  header: { height: 50, backgroundColor: theme.primaryColor },
  row: { height: 40, backgroundColor: "#F1F8FF" },
  text: { textAlign: "center" },
  headerText: { textAlign: "center", fontWeight: "600", color: "white" },
});

export default MedicalTable;
