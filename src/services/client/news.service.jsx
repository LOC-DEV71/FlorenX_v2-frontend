import axiosClient from "../../utils/axios.client"

export const getBySLug = (slug) => {
    return axiosClient.get(`/news/${slug}`);
}