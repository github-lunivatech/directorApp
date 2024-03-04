import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { makeApiRequest, apiEndpoints } from "../../../services/constants/url";

const ReportComponent = ({ route }) => {
  const [patientDetails, setPatientDetails] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await makeApiRequest(
          apiEndpoints.GetNormalReportByPatientId,
          {
            sampleId: route.params,
            fiscalyearId: 6,
          }
        );
        const data = response || {};
        console.log(data);
        // Extracting patient details
        const patientDetailsData = data.PatientDetails || [];
        setPatientDetails(patientDetailsData);

        // Extracting and arranging test list data
        const testListData = data.TestList || [];
        const groupedTestData = {};

        // Grouping test list data by panel name and group name
        testListData.forEach((test) => {
          const { Panel, GroupName, Testname, TestSubType, subtestId } = test;
          if (!groupedTestData[Panel]) {
            groupedTestData[Panel] = {};
          }
          if (!groupedTestData[Panel][GroupName]) {
            groupedTestData[Panel][GroupName] = {};
          }
          if (subtestId) {
            if (!groupedTestData[Panel][GroupName][Testname]) {
              groupedTestData[Panel][GroupName][Testname] = [];
            }
            groupedTestData[Panel][GroupName][Testname].push({
              TestSubType,
              ...test,
            });
          } else {
            if (!groupedTestData[Panel][GroupName][Testname]) {
              groupedTestData[Panel][GroupName][Testname] = [];
            }
            groupedTestData[Panel][GroupName][Testname].push(test);
          }
        });

        setGroupedData(groupedTestData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setError("Error fetching report data. Please try again later.");
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <View style={styles.sectionContainer}>
              <Text style={styles.heading}>Patient Details</Text>
              <View>
                {patientDetails.map((patient, index) => (
                  <View key={index} style={styles.dataContainer}>
                    <Text>
                      <Text style={styles.boldText}>Name:</Text>{" "}
                      {patient.FirstName}
                    </Text>
                    <Text>
                      <Text style={styles.boldText}>Sample Id:</Text>{" "}
                      {route.params}
                    </Text>
                    <Text>
                      <Text style={styles.boldText}>Sex:</Text> {patient.Sex}
                    </Text>
                    <Text>
                      <Text style={styles.boldText}>Age:</Text> {patient.Age}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            {Object.keys(groupedData).map((panelName, panelIndex) => (
              <View key={panelIndex} style={styles.panelContainer}>
                <Text style={styles.panelText}>{panelName}</Text>
                {Object.keys(groupedData[panelName]).map(
                  (groupName, groupIndex) => (
                    <View key={groupIndex} style={styles.groupContainer}>
                      {panelName != groupName && (
                        <Text style={styles.groupText}>{groupName}</Text>
                      )}
                      {Object.keys(groupedData[panelName][groupName]).map(
                        (testName, idx) => (
                          <View key={idx} style={styles.testContainer}>
                            {panelName == groupName ? (
                              <Text style={styles.testText}>{testName}</Text>
                            ) : (
                              <Text style={styles.testText}>{testName}</Text>
                            )}
                            {groupedData[panelName][groupName][testName].map(
                              (subtest, subIdx) => (
                                <View
                                  key={subIdx}
                                  style={styles.subtestContainer}
                                >
                                  {subtest.TestSubType && (
                                    <Text
                                      style={[
                                        styles.subtestText,
                                        { fontWeight: "bold" },
                                      ]}
                                    >
                                      Sub Test: {subtest.TestSubType}
                                    </Text>
                                  )}
                                  <View style={{ flexDirection: "row" }}>
                                    <Text style={styles.subtestText}>
                                      Test Method: {subtest.Method}
                                    </Text>
                                    <Text
                                      style={[
                                        {
                                          marginLeft: 70,
                                        },
                                      ]}
                                    >
                                      {subtest.TestSubType && (
                                        <Text
                                          style={[
                                            styles.subtestText,
                                            {
                                              fontWeight: "bold",
                                            },
                                          ]}
                                        >
                                          {subtest.subresult}
                                        </Text>
                                      )}
                                      {subtest.TestResult && (
                                        <Text
                                          style={[
                                            styles.subtestText,
                                            { fontWeight: "bold" },
                                          ]}
                                        >
                                          TestResult: {subtest.TestResult}
                                        </Text>
                                      )}
                                    </Text>
                                  </View>

                                  <Text style={styles.subtestText}>
                                    {subtest.Range &&
                                    (subtest.Range.includes("</br>") ||
                                      subtest.Range.includes("<br>"))
                                      ? subtest.Range.replace("<br>", "</br>")
                                          .split("</br>")
                                          .map((range, index) => (
                                            <Text key={index}>
                                              {range}
                                              {"\n"}
                                            </Text>
                                          ))
                                      : subtest.Range &&
                                        subtest.Range.replace(/<[^>]+>/g, "")}
                                    {subtest.Max &&
                                    (subtest.Max.includes("</br>") ||
                                      subtest.Max.includes("<br>"))
                                      ? subtest.Max.replace("</br>", "<br>")
                                          .split("<br>")
                                          .map((max, index) => (
                                            <Text key={index}>
                                              {max}
                                              {"\n"}
                                            </Text>
                                          ))
                                      : subtest.Max &&
                                        subtest.Max.replace(/<[^>]+>/g, "")}
                                  </Text>
                                </View>
                              )
                            )}
                          </View>
                        )
                      )}
                    </View>
                  )
                )}
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  dataContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  panelContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
  },
  panelText: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  groupContainer: {
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  groupText: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  testContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  testText: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtestContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  subtestText: {},
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default ReportComponent;
