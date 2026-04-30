import axiosAdmin from "../../utils/axios.client"

export const getVoucher = async (slug) => {
  return axiosAdmin.get(`/vouchers`);
}
