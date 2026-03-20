import axiosAdmin from "../../utils/axios.admin";

export const getTrashList = async () => {
  const res = await axiosAdmin.get("/trashcan");
  return res.data;
};

export const restoreTrashItem = async (type, id) => {
  const res = await axiosAdmin.patch(`/trashcan/restore/${type}/${id}`);
  return res.data;
};

export const restoreAllTrash = async () => {
  const res = await axiosAdmin.patch("/trashcan/restore-all");
  return res.data;
};

export const deleteTrashItem = async (type, id) => {
  const res = await axiosAdmin.delete(`/trashcan/delete/${type}/${id}`);
  return res.data;
};

export const deleteSelectedTrash = async (items) => {
  const res = await axiosAdmin.delete("/trashcan/delete-selected", {
    data: { items },
  });
  return res.data;
};

export const deleteAllTrash = async () => {
  const res = await axiosAdmin.delete("/trashcan/delete-all");
  return res.data;
};