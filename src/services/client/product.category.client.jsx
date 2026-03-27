import axiosAdmin from "../../utils/axios.client"

export const getTreeCategory = () =>{
    return axiosAdmin.get("/product-categories/tree-categories")
}
export const getBySlug = (cate) =>{
    return axiosAdmin.get(`/product-categories/${cate}`)
}