import axiosAdmin from "../../utils/axios.admin";

const PREFIX = "/member-tiers";

export const getTiers = async () => {
  return await axiosAdmin.get(`${PREFIX}`);
};

export const createTier = async (data) => {
  return await axiosAdmin.post(`${PREFIX}/create`, data);
};

export const editTier = async (id, data) => {
  return await axiosAdmin.patch(`${PREFIX}/edit/${id}`, data);
};

export const deleteTier = async (id) => {
  return await axiosAdmin.delete(`${PREFIX}/delete/${id}`);
};
