import axiosAdmin from "../../utils/axios.admin";

export const getProductPreview = (slug) =>{
    return axiosAdmin.get(`/product-preview/get-list/${slug}`)
}

export const adminReturnReview = (data) => {
    return axiosAdmin.post("/product-preview/return-review", data)
}
