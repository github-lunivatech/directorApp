import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { makeApiRequest, apiEndpoints } from "../../../services/constants/url";
import { ScrollView } from "react-native-gesture-handler";

const NormalReport = ({ route }) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(route.params);
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
        const data = response || [];
        // console.log(data);
        console.log(data["PatientDetails"], "Patient List");
        console.log(data["TestList"], "TestList");
        console.log(data["CheckerList"], "CheckList");
        setReportData(data);
        setLoading(false);
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
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Patient Details:</Text>
      {reportData["PatientDetails"].map((patient, index) => (
        <View key={index}>
          {Object.entries(patient).map(([key, value]) => (
            <Text key={key}>
              {key}: {value}
            </Text>
          ))}
        </View>
      ))}

      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
        Test List:
      </Text>
      {reportData["TestList"].map((test, index) => (
        <View key={index}>
          {Object.entries(test).map(([key, value]) => (
            <Text key={key}>
              {key}: {value}
            </Text>
          ))}
        </View>
      ))}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 20,
        }}
      >
        Checker List:
      </Text>
      {reportData["CheckerList"].map((checker, index) => (
        <View key={index} style={{ paddingBottom: 30 }}>
          {Object.entries(checker).map(([key, value]) => (
            <Text key={key}>
              {key}: {value}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default NormalReport;
