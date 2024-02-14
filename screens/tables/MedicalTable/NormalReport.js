import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
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
          {Object.keys(groupedData).map((panelName, panelIndex) => (
            <View key={panelIndex}>
              <Text style={{ fontWeight: "bold" }}>{panelName}</Text>
              {Object.keys(groupedData[panelName]).map(
                (groupName, groupIndex) => (
                  <View key={groupIndex}>
                    {console.log(groupedData, "this is grouped data")}
                    {<Text style={{ fontWeight: "bold" }}>{groupName}</Text>}
                    {Object.keys(groupedData[panelName][groupName]).map(
                      (testName, idx) => (
                        <View key={idx}>
                          <Text style={{ fontWeight: "bold" }}>{testName}</Text>
                          {groupedData[panelName][groupName][testName].map(
                            (subtest, subIdx) => (
                              <View key={subIdx} style={{ paddingLeft: 10 }}>
                                {subtest.TestSubType && (
                                  <Text>
                                    Test SubType: {subtest.TestSubType}
                                  </Text>
                                )}
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
        </ScrollView>
      )}
    </View>
  );
};

export default ReportComponent;
