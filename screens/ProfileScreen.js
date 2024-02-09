import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = ({ setIsLoggedIn }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Function to retrieve user data from AsyncStorage
    const retrieveUserData = async () => {
      try {
        const data = await AsyncStorage.getItem("userToken");
        if (data !== null) {
          setUserData(JSON.parse(data));
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    retrieveUserData();
  }, []);

  const handleLogout = async () => {
    // Perform logout actions, such as clearing user data from AsyncStorage
    await AsyncStorage.removeItem("userToken");
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.userDataContainer}>
        <Text style={styles.heading}>User Details</Text>
        {userData ? (
          <>
            <Text style={styles.userDataText}>
              Username: {userData.CheckValidLoginDirectorApp[0].usrUsername}
            </Text>
            <Text style={styles.userDataText}>
              Role: {userData.CheckValidLoginDirectorApp[0].roleName}
            </Text>
          </>
        ) : (
          <Text style={styles.noDataText}>No user data found</Text>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  userDataContainer: {
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userDataText: {
    fontSize: 18,
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 18,
    fontStyle: "italic",
    color: "gray",
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "tomato",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
