import axiosAdmin from "../../utils/axios.admin";

export const getNews = (data = {}) => {
  const params = new URLSearchParams();

  if (data.page) params.append("page", data.page);
  if (data.limit) params.append("limit", data.limit);
  if (data.keyword) params.append("keyword", data.keyword);
  if (data.status) params.append("status", data.status);
  if (data.category) params.append("category", data.category);
  if (data.sort) params.append("sort", data.sort);
  if (data.featured) params.append("featured", data.featured);

  return axiosAdmin.get(`/news?${params.toString()}`);
};

export const createNews = (data) => {
  return axiosAdmin.post(`/news/create`, data);
};

export const changeMultiNews = (data) => {
  return axiosAdmin.post(`/news/change-multi`, data);
};

export const getNewsBySlug = (slug) => {
  return axiosAdmin.get(`/news/${slug}`);
};

export const updateNews = (slug, data) => {
  return axiosAdmin.post(`/news/update/${slug}`, data);
};