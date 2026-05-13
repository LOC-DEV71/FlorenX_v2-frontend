import axiosClient from "../../utils/axios.client"

export const getList = (slug) => {
    return axiosClient.get(`/orders/get-list`);
}