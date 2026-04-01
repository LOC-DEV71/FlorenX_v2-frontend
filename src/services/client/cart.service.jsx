import axiosAdmin from "../../utils/axios.client";


export const addToCart = (data) => {
    return axiosAdmin.post("/cart/add-to-cart", data)
}


export const getCart = () => {
    return axiosAdmin.get("/cart", )
}

export const updateQuantity = (data) => {
    return axiosAdmin.post("/cart/update-quantity", data)
}