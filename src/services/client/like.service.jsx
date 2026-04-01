import axiosAdmin from "../../utils/axios.client";

export const addLike = (data) => {
    return axiosAdmin.post(`/like/add-like`, data);
}
export const getListLike = () => {
    return axiosAdmin.get(`/like/get-like`);
}

export const getListLikeProducts = () => {
    return axiosAdmin.get(`/like/get-like-products`);
}
 