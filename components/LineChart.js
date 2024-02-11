import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const LineChart = ({ data, color }) => {
  const maxHeight = 40;

  const getPath = () => {
    if (!data || data.length === 0) return "";

    const width = 100; // Adjust the width as needed
    const maxDataValue = Math.max(...data);
    const step = width / (data.length - 1);

    // Calculate the maximum height based on the maximum data value

    // Build SVG path data for a smooth curve using cubic Bezier curves
    let pathData = `M 0,${maxHeight * (1 - data[0] / maxDataValue)}`;
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = i * step;
      const y1 = maxHeight * (1 - data[i] / maxDataValue);
      const x2 = (i + 1) * step;
      const y2 = maxHeight * (1 - data[i + 1] / maxDataValue);
      const xc1 = (x1 + x2) / 2;
      const yc1 = y1;
      const xc2 = (x1 + x2) / 2;
      const yc2 = y2;
      pathData += ` C ${xc1},${yc1} ${xc2},${yc2} ${x2},${y2}`;
    }

    return pathData;
  };

  return (
    <Svg width="120%" height="100%" viewBox={`0 0 100 ${maxHeight}`}>
      <Path d={getPath()} fill="transparent" stroke={color} strokeWidth="4" />
    </Svg>
  );
};

export default LineChart;
