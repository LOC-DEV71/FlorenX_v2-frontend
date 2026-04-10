import axiosAdmin from "../../utils/axios.admin";

export const inventoryImport = async (data) => {
  return axiosAdmin.post("/inventory/import/create", data);
};
export const getListInventoryImport = async (data) => {
  const params = new URLSearchParams();
  if(data.limit) params.append("limit", data.limit)
  if(data.page) params.append("page", data.page)
  return axiosAdmin.get(`/inventory/import/get-list?${params.toString()}`);
};
