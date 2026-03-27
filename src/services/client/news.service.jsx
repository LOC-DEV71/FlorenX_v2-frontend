import axiosAdmin from "../../utils/axios.client"

export const getBySLug = (slug) => {
    return axiosAdmin.get(`/news/${slug}`);
}