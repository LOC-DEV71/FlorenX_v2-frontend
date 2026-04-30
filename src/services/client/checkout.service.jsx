import axiosClient from "../../utils/axios.client"; 

export const createPaypalOrder = (amount) => {
  return axiosClient.post("/checkout/paypal/create-order", { amount });
};

export const capturePaypalOrder = (orderID) => {
  return axiosClient.post("/checkout/paypal/capture-order", { orderID });
};

export const OrderSubmit = (form) => {
  return axiosClient.post("/checkout/order", form );
};


export const getDetailOrder = (orderCode) => {
  return axiosClient.get(`/checkout/order/detail/${orderCode}`);
};