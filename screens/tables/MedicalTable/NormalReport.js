import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { makeApiRequest, apiEndpoints } from "../../../services/constants/url";

const ReportComponent = ({ route }) => {
  const [patientDetails, setPatientDetails] = useState([]);
  const [testList, setTestList] = useState([]);
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
        // Extracting patient details
        const patientDetailsData = data.PatientDetails || [];
        setPatientDetails(patientDetailsData);

        // Extracting and arranging test list data
        const testListData = data.TestList || [];
        const groupedTestData = {};

        // Grouping test list data by panel name
        testListData.forEach((test) => {
          const { Panel, GroupName, Testname, TestSubType, subtestId } = test;
          if (!groupedTestData[Panel]) {
            groupedTestData[Panel] = {};
          }
          if (!groupedTestData[Panel][GroupName]) {
            groupedTestData[Panel][GroupName] = [];
          }
          if (subtestId) {
            // If subtestId is present, group under Testname
            if (!groupedTestData[Panel][GroupName][Testname]) {
              groupedTestData[Panel][GroupName][Testname] = [];
            }
            groupedTestData[Panel][GroupName][Testname].push({
              TestSubType,
              ...test,
            });
          } else {
            // If subtestId is null, add as independent test
            if (!groupedTestData[Panel][GroupName]) {
              groupedTestData[Panel][GroupName] = [];
            }
            groupedTestData[Panel][GroupName].push(test);
          }
        });

        setTestList(groupedTestData);
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
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <ScrollView>
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Patient Details
            </Text>
            <View>
              {patientDetails.map((patient, index) => (
                <View key={index}>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>Name:</Text>{" "}
                    {patient.FirstName}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Test List</Text>
            {Object.keys(testList).map((panelName) => (
              <View key={panelName}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {panelName}
                </Text>
                {Object.keys(testList[panelName]).map((groupName) => (
                  <View key={groupName}>
                    {groupName !== "Independent" && (
                      <Text style={{ fontWeight: "bold" }}>
                        Group Name: {groupName}
                      </Text>
                    )}
                    {testList[panelName][groupName].map((test, index) => (
                      <View key={index}>
                        <Text>
                          <Text style={{ fontWeight: "bold" }}>Test Name:</Text>{" "}
                          {test.Testname}{" "}
                          {test.subtestId && `(${test.TestSubType})`}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
                {testList[panelName]["Independent"] && (
                  <View>
                    <Text style={{ fontWeight: "bold" }}>
                      Independent Tests
                    </Text>
                    {testList[panelName]["Independent"].map((test, index) => (
                      <View key={index}>
                        <Text>
                          <Text style={{ fontWeight: "bold" }}>Test Name:</Text>{" "}
                          {test.Testname}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default ReportComponent;
