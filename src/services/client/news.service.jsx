import axiosClient from "../../utils/axios.client"

export const getByCategory = (slug) => {
    return axiosClient.get(`/news/category/${slug}`);
}


export const getBySlug = (slug) => {
    return axiosClient.get(`/news/${slug}`);
}