import axiosClient from "../../utils/axios.client";


export const addToCart = (data) => {
    return axiosClient.post("/cart/add-to-cart", data)
}


export const getCart = () => {
    return axiosClient.get("/cart", )
}

export const updateQuantity = (data) => {
    return axiosClient.post("/cart/update-quantity", data)
}