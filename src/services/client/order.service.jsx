import axiosClient from "../../utils/axios.client"

export const getList = (slug) => {
    return axiosClient.get(`/orders/get-list`);
}

export const getTotalSpent = () => {
    return axiosClient.get(`/orders/get-total-spent`);
}

export const cancelOrder = (id) => {
    return axiosClient.patch(`/orders/cancel-order/${id}`);
}