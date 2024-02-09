import React from "react";
import { View, Button, StyleSheet } from "react-native";
import * as Print from "expo-print";

const ExportToPDFButton = ({ tableData = [], pageTitle, reportType }) => {
  console.log(pageTitle, "Page title", reportType);
  const exportToPDF = async () => {
    try {
      // Generate HTML content for the PDF
      const htmlContent = generateHTMLContent(tableData, pageTitle, reportType);

      // Create the PDF document
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      // Print the PDF document
      await Print.printAsync({ uri });
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    }
  };

  // Function to generate HTML content for the PDF
  const generateHTMLContent = (tableData, pageTitle, reportType) => {
    if (!tableData.length) return ""; // Return empty string if tableData is empty

    // Extract column headers dynamically from the first object in tableData
    const columnHeaders = Object.keys(tableData[0]);

    // Generate table rows
    const tableRows = tableData
      .map((rowData, index) => {
        // Generate HTML for each cell in the row
        const cells = columnHeaders.map((header) => {
          const value = rowData[header];
          return `<td>${value}</td>`;
        });
        return `<tr key=${index}>${cells.join("")}</tr>`;
      })
      .join("");

    // Construct the complete HTML content with the table
    const htmlContent = `
      <html>
        <head>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <h2>${pageTitle}</h2>
          <h3>Report Type: ${reportType}</h3>
          <table>
            <thead>
              <tr>
                ${columnHeaders.map((header) => `<th>${header}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    return htmlContent;
  };

  return (
    <View style={styles.container}>
      <Button title="Export" onPress={exportToPDF} color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-end",
    marginTop: 20,
    backgroundColor: "#047bc2",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

export default ExportToPDFButton;
