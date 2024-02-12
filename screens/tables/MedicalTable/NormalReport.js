import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { makeApiRequest, apiEndpoints } from "../../../services/constants/url";
import { ScrollView } from "react-native-gesture-handler";

const NormalReport = ({ route }) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedTestList, setGroupedTestList] = useState({});

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
        setReportData(data);
        setLoading(false);

        if (data && data.TestList) {
          // Group tests by Panel name
          const groupedTests = data.TestList.reduce((groups, test) => {
            const { Panel } = test;
            if (!groups[Panel]) {
              groups[Panel] = [];
            }
            groups[Panel].push(test);
            return groups;
          }, {});
          setGroupedTestList(groupedTests);
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
        setLoading(false);
      }
    };

    fetchReportData();
  }, [route.params]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!reportData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        {reportData["PatientDetails"][0]["FirstName"]}
      </Text>

      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
        Test List:
      </Text>
      {Object.entries(groupedTestList).map(([panelName, tests]) => (
        <View key={panelName}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>
            Panel: {panelName}
          </Text>
          {tests.map((test, index) => (
            <View key={index} style={{ marginLeft: 20 }}>
              <Text>{test.Testname}</Text>
              {/* Render other test details here */}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default NormalReport;
