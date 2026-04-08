import axiosAdmin from "../../utils/axios.admin";

export const createInventoryAudit = async (data) => {
  return axiosAdmin.post("/inventory-audit", data);
};
export const getInventoryAuditList = async (data) => {
  const params = new URLSearchParams();
  if(data.limit) params.append("limit", data.limit)
  if(data.page) params.append("page", data.page)
  if(data.search) params.append("search", data.search)
  return axiosAdmin.get(`/inventory-audit/get-list?${params.toString()}`);
};

export const getInventoryAuditDetail = async (code) => {
  return axiosAdmin.get(`/inventory-audit/detail/${code}`);
};

// export const getInventoryAuditList = async (params) => {
//   return axiosAdmin.get("/admin/inventory-audit", { params });
// };

// export const getInventoryAuditDetail = async (id) => {
//   return axiosAdmin.get(`/admin/inventory-audit/${id}`);
// };

// export const confirmInventoryAudit = async (id, data = {}) => {
//   return axiosAdmin.patch(`/admin/inventory-audit/${id}/confirm`, data);
// };