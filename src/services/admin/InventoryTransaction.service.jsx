import axiosAdmin from "../../utils/axios.admin";

export const inventoryImport = async (data) => {
  return axiosAdmin.post("/inventory/import", data);
};
