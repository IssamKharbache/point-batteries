import axios from "axios";

export const getData = async (endpoint: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  console.log(baseUrl);
  console.log(`${baseUrl}/api/${endpoint}`);

  const response = await axios.get(`${baseUrl}/api/${endpoint}`);
  const data = response.data.data;
  return data;
};
