import axiosClient from "../../utils/axios.client"

export const commentProduct = async (comment) => {
  return axiosClient.post("/product-preview/comment", comment)
}

export const getList = async (slug) => {
  return axiosClient.get(`/product-preview/get-list?slug=${slug}`)
}

export const getProductPreview = async () => {
  return axiosClient.get(`/product-preview/get-order-preview`)
}