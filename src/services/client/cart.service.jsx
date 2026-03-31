import axiosAdmin from "../../utils/axios.client";


export const addToCart = (data) => {
    return axiosAdmin.post("/cart/add-to-cart", data)
}


export const getCart = () => {
    return axiosAdmin.get("/cart", )
}