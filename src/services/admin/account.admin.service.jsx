import axiosAdmin from "../../utils/axios.admin";

export const getListAccount = (data) => {
    const params = new URLSearchParams();
    if(data.page) params.append("page", data.page)
    if(data.limit) params.append("limit", data.limit)
    if(data.sort) params.append("sort", data.sort)
    return axiosAdmin.get(`/accounts?${params.toString()}`);
}

export const changeMulti = (data) => {
  return axiosAdmin.post(`/accounts/change-multi`, data);
}

export const createAccount = (data) => {
    return axiosAdmin.post("/accounts/create", data);
}

export const updateAccount = ({id, data}) => {
    return axiosAdmin.post(`/accounts/update/${id}`, data);
}

export const getAccountById = (id) => {
    return axiosAdmin.get(`/accounts/${id}`);
}