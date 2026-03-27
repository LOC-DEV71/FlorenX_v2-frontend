import axiosAdmin from "../../utils/axios.client"

export const getProductByCategory = async (data) => {
  const params = new URLSearchParams();
  if(data.price) params.append("price", data.price)
    console.log(data.discount)
  if(data.discount) params.append("discount", data.discount)
  return axiosAdmin.get(`/products/${data.category}?${params}`);
}