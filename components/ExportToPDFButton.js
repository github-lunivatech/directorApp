import React from "react";
import { View, Button, StyleSheet, TouchableOpacity, Text } from "react-native";
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
            thead {
              display: table-header-group; /* Ensure header is repeated on every page */
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
    <TouchableOpacity
      onPress={exportToPDF}
      style={[styles.button, styles.applyButton, { alignSelf: "flex-end" }]}
    >
      <Text style={[styles.buttonText]}>Export</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#C1C0B9",
    backgroundColor: "white",
    width: 320,
    marginBottom: -2,
  },
  applyButton: {
    backgroundColor: "#047bc2",
    width: 115,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default ExportToPDFButton;
