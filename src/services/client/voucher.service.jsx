import axiosClient from "../../utils/axios.client"

export const getVoucher = async (slug) => {
  return axiosClient.get(`/vouchers`);
}
