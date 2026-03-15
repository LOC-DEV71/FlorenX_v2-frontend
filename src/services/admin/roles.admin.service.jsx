import axiosAdmin from "../../utils/axios.admin";

export const getListRolesIndex = (data) => {
    const params = new URLSearchParams();
    if(data.page) params.append("page", data.page);
    if(data.limit) params.append("limit", data.limit);
    if(data.sort) params.append("sort", data.sort);
    return axiosAdmin.get(`/roles?${params.toString()}`)
}

export const getListRoles = () => {
    return axiosAdmin.get(`/roles`)
}

export const createRole = (data) => {
    return axiosAdmin.post("/roles/create", data)
}

export const getRoleBySlug = (slug) => {
    return axiosAdmin.get(`/roles/${slug}`)
}


export const updateRole = ({ slug, payLoad }) => {
    return axiosAdmin.post(`/roles/update/${slug}`, payLoad)
}

export const changeMulti = (data) => {
  return axiosAdmin.post(`/roles/change-multi`, data);
}