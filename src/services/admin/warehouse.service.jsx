import axiosAdmin from "../../utils/axios.admin";

export const getWarehouseList = async () => {
  return axiosAdmin.get("/warehouse/get-list");
};
