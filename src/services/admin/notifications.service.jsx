import axiosAdmin from "../../utils/axios.admin";

export const getList = () => {
  return axiosAdmin.get(`/notifications/get-list`);
};

export const readNotification = (id) => {
  return axiosAdmin.post(`/notifications/read/${id}`);
};

