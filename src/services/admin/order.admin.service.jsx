import axiosAdmin from "../../utils/axios.admin";

export const listOrder = (data) => {
    const params = new URLSearchParams();

    if (data.page) params.append("page", data.page);
    if (data.limit) params.append("limit", data.limit);
    if (data.sort) params.append("sort", data.sort);
    if (data.search) params.append("search", data.search);

    return axiosAdmin.get(`/orders/get-list?${params.toString()}`);
};

export const updateOrderStatus = (data) => {
    return axiosAdmin.patch(`/orders/update-status`, data);
};