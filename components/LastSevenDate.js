import React from "react";
import { Text, View, StyleSheet } from "react-native";

const formatDate = (date) => {
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  return `${month} ${day}`;
};

const LastSevenDaysDateRange = () => {
  const today = new Date();
  const lastSevenDays = new Date(today);
  lastSevenDays.setDate(today.getDate() - 6);

  const startDate = formatDate(lastSevenDays);
  const endDate = formatDate(today);

  return (
    <Text>
      {startDate} - {endDate}
    </Text>
  );
};

export default LastSevenDaysDateRange;
