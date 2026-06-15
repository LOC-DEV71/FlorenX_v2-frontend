import axiosClient from "../../utils/axios.client"

export const getCategories = () => {
    return axiosClient.get(`/news/categories`);
}

export const getRecentNews = () => {
    return axiosClient.get(`/news/recent`);
}

export const getByCategory = (slug, params = {}) => {
    return axiosClient.get(`/news/category/${slug}`, { params });
}

export const getDetailBySlug = (slug) => {
    return axiosClient.get(`/news/detail/${slug}`);
}