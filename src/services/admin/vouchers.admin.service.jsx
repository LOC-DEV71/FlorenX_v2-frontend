import axiosAdmin from "../../utils/axios.admin";

export const getVouchers = async () => {
    return await axiosAdmin.get(`/vouchers`);
};

export const getVoucherById = async (id) => {
    return await axiosAdmin.get(`/vouchers/detail/${id}`);
};

export const createVoucher = async (data) => {
    return await axiosAdmin.post(`/vouchers/create`, data);
};

export const editVoucher = async (id, data) => {
    return await axiosAdmin.patch(`/vouchers/edit/${id}`, data);
};

export const deleteVoucher = async (id) => {
    return await axiosAdmin.delete(`/vouchers/delete/${id}`);
};
