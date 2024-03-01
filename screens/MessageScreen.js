import React, { useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { WebView } from "react-native-webview";

const MessageScreen = () => {
  const [showWebView, setShowWebView] = useState(false);
  const webViewRef = useRef(null);

  const handleLinkPress = () => {
    setShowWebView(true);
  };

  const goBack = () => {
    setShowWebView(false);
    if (webViewRef.current) {
      webViewRef.current.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {!showWebView ? (
        <TouchableOpacity onPress={handleLinkPress} style={styles.linkButton}>
          <Text style={styles.link}>Press to open Bill Test Login</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.webviewContainer}>
          <WebView
            source={{
              uri: "https://lunivat.ddns.net/billTest/Carelab/Account/Login",
            }}
            style={[styles.webview]}
            ref={webViewRef}
          />
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  link: {
    fontSize: 16,
    color: "#fff",
  },
  webviewContainer: {
    flex: 1,
    width: "100%",
  },
  webview: {
    flex: 1,
    width: "100%",
  },
  backButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#047bc2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  linkButton: {
    backgroundColor: "#047bc2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default MessageScreen;
