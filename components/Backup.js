import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import * as Print from "expo-print";

const ExportToPDFButton = ({ tableData = [], pageTitle, reportType }) => {
  const exportToPDF = async () => {
    try {
      const htmlContent = generateHTMLContent(tableData, pageTitle, reportType);
      await Print.printAsync({ html: htmlContent });
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    }
  };

  const generateHTMLContent = (tableData, pageTitle, reportType) => {
    if (!tableData.length) return "";

    const columnHeaders = Object.keys(tableData[0]);

    const tableRows = tableData
      .map((rowData, index) => {
        const cells = columnHeaders.map((header) => {
          const value = rowData[header];
          return `<td>${value}</td>`;
        });
        return `<tr key=${index}>${cells.join("")}</tr>`;
      })
      .join("");

    const htmlContent = `
      <html>
        <head>
          <style>
            @page {
              size: A4 landscape;
              margin: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
              word-wrap: break-word;
            }
            thead {
              background-color: #047bc2;
              color: white;
            }
            h2, h3 {
              text-align: center;
            }
          
          </style>
        </head>
        <body >
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
    <TouchableOpacity onPress={exportToPDF} style={styles.button}>
      <Text style={styles.buttonText}>Export</Text>
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
    backgroundColor: "#047bc2",
    width: 115,
    alignSelf: "flex-end",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default ExportToPDFButton;
