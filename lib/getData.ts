import axios from "axios";

export const getData = async (endpoint: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await axios.get(`${baseUrl}/api/${endpoint}`);
    const data = response.data.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data?.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
};
