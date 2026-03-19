import axiosAdmin from "../../utils/axios.admin";

export const getNewsCategories = (data) => {
  const params = new URLSearchParams();

  if (data.page) params.append("page", data.page);
  if (data.limit) params.append("limit", data.limit);
  if (data.sort) params.append("sort", data.sort);
  if (data.status) params.append("status", data.status);
  if (data.keyword) params.append("keyword", data.keyword);

  return axiosAdmin.get(`/news-category?${params.toString()}`);
};
export const getList = () => {
  return axiosAdmin.get(`/news-category/get-list`);
};

export const changeMultiNewsCategory = (data) => {
  return axiosAdmin.post("/news-category/change-multi", data);
};

export const getBySlug = (slug) => {
  return axiosAdmin.get(`/news-category/${slug}`);
};

export const createNewsCategory = (data) => {
  return axiosAdmin.post("/news-category/create", data);
};

export const updateNewsCategory = (data) => {
  return axiosAdmin.post("/news-category/update", data);
};