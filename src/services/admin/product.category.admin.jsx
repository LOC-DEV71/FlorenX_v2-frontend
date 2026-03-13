import axiosAdmin from "../../utils/axios.admin";

export const createProductCategory = (data) =>{
    return axiosAdmin.post("/product-categories/create", data)
}


export const UpdateProductCategory = (data) =>{
    return axiosAdmin.post(`/product-categories/update?slug=${data.slug}`, data.formData)
}

export const getTreeCategory = (data) =>{
    const params = new URLSearchParams();
    if(data.sort) params.append("sort", data.sort)
    return axiosAdmin.get(`/product-categories?${params.toString()}`)
}

export const getListCategory = () =>{
    return axiosAdmin.get(`/product-categories/get-list`)
}

export const getCategoryBySlug = (slug) =>{
    return axiosAdmin.get(`/product-categories/detail/${slug}`)
}

export const changeMulti = (data) => {
  return axiosAdmin.post(`/product-categories/change-multi`, data);
}