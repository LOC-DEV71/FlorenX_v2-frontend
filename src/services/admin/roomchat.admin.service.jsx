import axiosAdmin from "../../utils/axios.admin";

export const getListRoom = (keyword = "") => {
  return axiosAdmin.get(`/room-chat/get-list?keyword=${keyword}`);
}