import axiosAdmin from "../../utils/axios.client"

export const getProductByCategory = async (data) => {
  const params = new URLSearchParams();
  if(data.price) params.append("price", data.price)
  if(data.discount) params.append("discount", data.discount)
  if(data.page) params.append("page", data.page)
  if(data.limit) params.append("limit", data.limit)
  return axiosAdmin.get(`/products/${data.category}?${params}`);
}

export const getProductBySlug = async (slug) => {
  return axiosAdmin.get(`/products/detail/${slug}`);
}