import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import * as Print from "expo-print";

const ExportToPDFButton = ({ tableData = [], pageTitle, reportType, row }) => {
  const exportToPDF = async () => {
    try {
      const htmlContent = generateHTMLContent(
        tableData,
        pageTitle,
        reportType,
        row
      );
      await Print.printAsync({ html: htmlContent });
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    }
  };

  const generateHTMLContent = (tableData, pageTitle, reportType, row) => {
    if (!tableData.length) return "";

    const columnHeaders = Object.keys(tableData[0]);
    const numberOfColumns = columnHeaders.length;

    const rowsPerPage = 4; // Adjust this number as needed
    const columnsThresholdForRotation = 10; // Adjust this number as needed

    let tableSections = [];
    let currentPageRows = 0;
    let currentSection = [];

    const isRotate = numberOfColumns > columnsThresholdForRotation;

    tableData.forEach((rowData, index) => {
      const cells = columnHeaders.map((header) => {
        const value = rowData[header];
        return `<td>${value}</td>`;
      });

      currentSection.push(`<tr>${cells.join("")}</tr>`);
      currentPageRows++;

      if (currentPageRows >= rowsPerPage) {
        tableSections.push(currentSection);
        currentSection = [];
        currentPageRows = 0;
      }
    });

    if (currentSection.length > 0) {
      tableSections.push(currentSection);
    }

    const headerRow = columnHeaders
      .map((header) => `<th>${header}</th>`)
      .join("");

    const tableHTML = tableSections
      .map(
        (section, index) => `
        <h2>${pageTitle}</h2>
        <h3>Report Type: ${reportType}</h3>
        <div class="${isRotate ? "landscape" : ""}">
          <table>
            <thead>
              <tr>${headerRow}</tr>
            </thead>
            <tbody>${section.join("")}</tbody>
          </table>
        </div>
        ${
          index < tableSections.length - 1
            ? '<div class="page-break"></div>'
            : ""
        }
      `
      )
      .join("");

    const htmlContent = `
      <html>
        <head>
          <style>
          .page {
            size: landscape;
            margin: 20px;
            transform: rotate(90deg);
            transform-origin: top left;
          }
          body {
            width: 100vw;       
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            overflow: hidden;
          }
          .content {
            transform: rotate(90deg);
            transform-origin: top left;
            overflow: hidden;
            width: 100vh; /* Swap width and height to fit rotated content */
            height: 100vw; /* Swap width and height to fit rotated content */
          }
          .page {
            width: 100%; /* Adjust as needed */
            height: 100%; /* Adjust as needed */
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

            .page-break {
              page-break-before: always;
            }
            @media print {
              thead {
                display: table-header-group;
              }
            }
          </style>
        </head>
        <body>
          ${tableHTML}
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
