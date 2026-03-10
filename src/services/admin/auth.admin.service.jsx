import axiosAdmin from "../../utils/axios.admin";


export const authLoginAdmin = (data) => {
  return axiosAdmin.post("/auth-admin/login", data);
};

export const getMeAdmin = () => {
  return axiosAdmin.get("/auth-admin/get-admin");
};