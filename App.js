// App.js
import React, { useState } from "react";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BottomTabNavigator from "./BottomTabNavigator";
import LoginScreen from "./screens/login/LoginScreen";

const App = () => {
  const colorScheme = useColorScheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <SafeAreaProvider>
      <BottomTabNavigator />
    </SafeAreaProvider>
  );
};

export default App;
