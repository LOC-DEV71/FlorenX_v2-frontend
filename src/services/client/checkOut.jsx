import axiosClient from "../../utils/axios.client";


export const checkOut = (data) => {
    return axiosClient.post("/checkout", data)
}
export const createRepayPayment = (data) => {
    return axiosClient.post("/checkout", data)
}
export const createVnpayPayment = (data) => {
    return axiosClient.post("/checkout", data)
}
