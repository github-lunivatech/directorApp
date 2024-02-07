import axios from "axios";

export const BASE_URL = "https://lunivat.ddns.net/billTest/CarelabService/api/";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Adjust the timeout as needed
});

// Define your API endpoints
export const apiEndpoints = {
  getTATRecordofTestByDateRange: "GetTATRecordofTestByDateRange",
  // Add more endpoints as needed
};

// Utility function to make POST API requests
export const makePostApiRequest = async (endpoint, data = {}) => {
  try {
    const response = await api.post(endpoint, data);
    // Log the response to the console
    console.log(`Response from ${endpoint}:`, response.data);
    return response.data;
  } catch (error) {
    // Log the error to the console
    console.error(`Error in ${endpoint}:`, error);
    throw error; // Rethrow the error to handle it where the request is made
  }
};
