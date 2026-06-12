import axiosAdmin from "../../utils/axios.admin";

const getSystemConfig = () => {
  return axiosAdmin.get("/system");
};

const updateSystemConfig = (data) => {
  return axiosAdmin.patch("/system", data);
};

export { getSystemConfig, updateSystemConfig };
