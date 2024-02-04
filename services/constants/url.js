import axios from "axios";

export const DEV_URL =
  "https://lunivacare.ddns.net/CarelabDataMetricService_dev";
export const BASE_URL = `${DEV_URL}/Api/`;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Adjust the timeout as needed
});

// Define your API endpoints
export const apiEndpoints = {
  // Finance
  GetDataMetricReportByReportTypeAndDateRange:
    "GetDataMetricReportByReportTypeAndDateRange",

  GetDailySummaryTransactionUserWiseByDate:
    "GetDailySummaryTransactionUserWiseByDate",
  GetListOfUserForMetric: "GetListOfUserForMetric",

  getRequestorList: "GetRequestorList",
  getDatewiseRequestorTransactionDetails:
    "GetDatewiseRequestorTransactionDetails",
  getRequestorwiseTotalSalesSummaryByDate:
    "GetRequestorwiseTotalSalesSummaryByDate",

  GetReferedDoctorList: "GetReferedDoctorList",
  GetDatewiseReferredDoctorTransactionDetails:
    "GetDatewiseReferredDoctorTransactionDetails",

  GetDailyTransactionByUserIdAndDate: "GetDailyTransactionByUserIdAndDate",

  GetDatewiseTotalSalesWithTestCount: "GetDatewiseTotalSalesWithTestCount",
  GetFiscalYearCodeList: "GetFiscalYearCodeList",

  GetCredityPartyDatewiseTotalSalesWithTestCount:
    "GetCredityPartyDatewiseTotalSalesWithTestCount",

  GetStates: "GetStates",
  GetDistrictsByStateId: "GetDistrictsByStateId",
  GetMunicipalitiesByDistrictId: "GetMunicipalitiesByDistrictId",
  GetGeographyWiseMISReports: "GetGeographyWiseMISReports",
  GeographicalTestwisePatientCountReport:
    "GeographicalTestwisePatientCountReport",
  GetReferedDoctorList: "GetReferedDoctorList",
  GetDatewiseReferredDoctorTransactionDetails:
    "GetDatewiseReferredDoctorTransactionDetails",
  GetCompanyDetails: "GetCompanyDetials",
  GetListOfReportType: "GetListOfReportType",
  GetDataMetricReportByReportTypeAndDateRange:
    "GetDataMetricReportByReportTypeAndDateRange",
  GetActualConsumptionReportByDateRange:
    "GetActualConsumptionReportByDateRange",
  GetDatametricReportType: "GetDatametricReportType",
  GetGeographyWiseMISReports: "GetGeographyWiseMISReports",
  GetValidCollectorLoginForApp: "GetValidCollectorLoginForApp",
};

// Utility function to make API requests
export const makeApiRequest = async (endpoint, params = {}) => {
  try {
    const response = await api.get(endpoint, { params });
    // Log the response to the console
    // console.log(`Response from ${endpoint}:`, response.data);
    return response.data;
  } catch (error) {
    // Log the error to the console
    // console.error(`Error in ${endpoint}:`, error);
    throw error; // Rethrow the error to handle it where the request is made
  }
};
