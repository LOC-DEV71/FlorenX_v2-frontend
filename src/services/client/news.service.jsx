import axiosClient from "../../utils/axios.client"

export const getCategories = () => {
    return axiosClient.get(`/news/categories`);
}

export const getRecentNews = () => {
    return axiosClient.get(`/news/recent`);
}

export const getByCategory = (slug) => {
    return axiosClient.get(`/news/category/${slug}`);
}

export const getDetailBySlug = (slug) => {
    return axiosClient.get(`/news/detail/${slug}`);
}