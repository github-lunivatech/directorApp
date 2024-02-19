import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeApiRequest, apiEndpoints } from "../../services/constants/url";
import Icon from "react-native-vector-icons/Feather";

const LoginScreen = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [companyDetails, setCompanyDetails] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await makeApiRequest(apiEndpoints.GetCompanyDetails);
        if (response && response.ReportType && response.ReportType[0]) {
          setCompanyDetails(response.ReportType[0]);
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };
    fetchCompanyDetails();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await makeApiRequest(
        apiEndpoints.CheckValidLoginDirectorApp,
        {
          username: username,
          password: password,
        }
      );
      if (response) {
        const userToken = response;
        await AsyncStorage.setItem("userToken", JSON.stringify(response));
        setIsLoggedIn(true);
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {companyDetails && companyDetails.COmpanyLOgo && (
          <View style={styles.logoContainer}>
            <Image
              source={{
                uri: `data:image/jpeg;base64,${companyDetails.COmpanyLOgo}`,
              }}
              style={styles.logo}
            />
            <Text style={[styles.companyName, { marginTop: 10 }]}>
              {companyDetails.CompanyName}
            </Text>
          </View>
        )}
        <Text style={styles.versionText}>Director App Version 1.0</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity
            style={styles.eyeIconContainer}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon
              name={showPassword ? "eye" : "eye-off"}
              size={24}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 130,
    height: 130,
  },
  companyName: {
    fontWeight: "bold",
    fontSize: 22,
  },
  versionText: {
    marginBottom: 20,
    fontWeight: "bold",
    color: "tomato",
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  passwordInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  eyeIconContainer: {
    position: "absolute",
    right: 10,
    top: 8,
  },
  button: {
    width: "80%",
    height: 40,
    backgroundColor: "tomato",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default LoginScreen;
