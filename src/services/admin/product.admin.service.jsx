import axiosAdmin from "../../utils/axios.admin";

export const createProduct = (data) => {
  return axiosAdmin.post("/products/create", data);
};

export const getProducts = (data) => {
  const params = new URLSearchParams();
  if(data.page) params.append("page", data.page)
  if(data.limit) params.append("limit", data.limit)
  if(data.sort) params.append("sort", data.sort)
  if(data.sortByCategory) params.append("sortByCategory", data.sortByCategory)
  return axiosAdmin.get(`/products?${params.toString()}`);
};

export const changeMulti = (data) => {
  return axiosAdmin.post(`/products/change-multi`, data);
}


export const getProductBySlug = (slug) => {
  return axiosAdmin.get(`/products/${slug}`);
}


export const updateProduct = (slug, data) => {
  return axiosAdmin.post(`/products/update/${slug}`, data);
}