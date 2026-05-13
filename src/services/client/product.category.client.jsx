import axiosClient from "../../utils/axios.client"

export const getTreeCategory = () =>{
    return axiosClient.get("/product-categories/tree-categories")
}
export const getBySlug = (cate) =>{
    return axiosClient.get(`/product-categories/${cate}`)
}