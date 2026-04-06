import axiosAdmin from "../../utils/axios.client";


export const checkOut = (data) => {
    return axiosAdmin.post("/checkout", data)
}
export const createRepayPayment = (data) => {
    return axiosAdmin.post("/checkout", data)
}
export const createVnpayPayment = (data) => {
    return axiosAdmin.post("/checkout", data)
}
