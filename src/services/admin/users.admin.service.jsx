import axiosAdmin from "../../utils/axios.admin";

export const getListUser = (data) => {
    const params = new URLSearchParams();
    if (data.page)   params.append("page", data.page);
    if (data.limit)  params.append("limit", data.limit);
    if (data.sort)   params.append("sort", data.sort);
    if (data.search) params.append("search", data.search);
    return axiosAdmin.get(`/users?${params.toString()}`);
};

export const getUserById = (id) => {
    return axiosAdmin.get(`/users/${id}`);
};

export const changeMulti = (data) => {
    return axiosAdmin.post(`/users/change-multi`, data);
};

export const updateUser = ({ id, data }) => {
    return axiosAdmin.patch(`/users/update/${id}`, data);
};