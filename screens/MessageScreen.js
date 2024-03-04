import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { makeApiRequest, apiEndpoints } from "../services/constants/url";

const MessageScreen = () => {
  const [showWebView, setShowWebView] = useState(false);
  const [reportLink, setReportLink] = useState("");
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);

  useEffect(() => {
    // Fetch the report link from the API
    const fetchReportLink = async () => {
      try {
        const response = await makeApiRequest(apiEndpoints.GetWebReportLink);
        const link = response.ReportLInk[0].ReportLink;
        setReportLink(link);
      } catch (error) {
        console.error("Error fetching report link:", error);
      }
    };

    fetchReportLink();
  }, []);

  const onLoadStart = () => {
    setLoading(true);
  };

  const onLoadEnd = () => {
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#047bc2" />
        </View>
      )}
      <View style={styles.webviewContainer}>
        <WebView
          source={{
            uri: reportLink,
          }}
          style={[styles.webview]}
          ref={webViewRef}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  webviewContainer: {
    flex: 1,
    width: "100%",
  },
  webview: {
    flex: 1,
    width: "100%",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MessageScreen;
