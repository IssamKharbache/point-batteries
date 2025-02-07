import axios from "axios";

export const getData = async (endpoint: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const fullUrl = `${baseUrl}/api${endpoint}`;
    console.log("Fetching data from:", fullUrl); // Log URL in production
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
    }

    const response = await axios.get(`${baseUrl}/api/${endpoint}`);
    return response.data.data;
  } catch (error) {
    console.error("Error in getData:", error);
    throw error;
  }
};
