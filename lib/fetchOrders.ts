// lib/fetchOrders.ts
export const fetchOrders = async (userId: string, page: number) => {
  const pageSize = 5; // Number of orders per page
  const response = await fetch(`/api/order/${userId}?pageNum=${page}`);
  const { data } = await response.json();
  return data;
};
