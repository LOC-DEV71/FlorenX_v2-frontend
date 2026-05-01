import axiosAdmin from "../../utils/axios.admin";

export const getListRoom = () => {
  return axiosAdmin.get(`/room-chat/get-list`);
}