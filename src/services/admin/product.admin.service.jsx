import axiosClient from "../../utils/axios.admin";

export const createProduct = (data) => {
  return axiosClient.post("/products/create", data);
};
