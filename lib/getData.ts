import axios from "axios";

export const getData = async (endpoint: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
    }
    const response = await axios.get(`${baseUrl}${endpoint}`, {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error in getData:", error);
    throw error;
  }
};
