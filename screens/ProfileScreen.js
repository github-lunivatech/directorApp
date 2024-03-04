import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import luniva360 from ".././assets/character.jpg";
import logoutIcon from "../assets/logout.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import background from "../assets/bkg6.png";

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
      {/* <Image
        source={background}
        style={styles.backgroundImage}
        resizeMode="cover"
      /> */}
      <View style={styles.profileContainer}>
        <Image source={luniva360} style={styles.profileImage} />
        {userData && (
          <View style={styles.userDataContainer}>
            <Text style={styles.usernameText}>
              Name: {userData.CheckValidLoginDirectorApp[0].usrUsername}
            </Text>
            <Text style={styles.roleText}>
              Role: {userData.CheckValidLoginDirectorApp[0].roleName}
            </Text>
            {userData.contact && (
              <Text style={styles.additionalInfo}>
                Contact: {userData.contact}
              </Text>
            )}
            {userData.email && (
              <Text style={styles.additionalInfo}>Email: {userData.email}</Text>
            )}
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Image source={logoutIcon} style={styles.logoutIcon} />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.2,
  },
  profileContainer: {
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 0,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userDataContainer: {
    alignItems: "center",
  },
  usernameText: {
    fontSize: 22,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#333",
  },
  roleText: {
    fontSize: 20,
    marginBottom: 10,
    color: "#555",
  },
  additionalInfo: {
    fontSize: 18,
    marginBottom: 5,
    color: "#777",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
    height: 50,
    backgroundColor: "#FF6F61",
    justifyContent: "center",
    borderRadius: 25,
    marginTop: 40,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },
  logoutIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
});

export default ProfileScreen;
