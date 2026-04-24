import axiosAdmin from "../../utils/axios.admin";

export const inventoryImport = async (data) => {
  return axiosAdmin.post("/inventory/import/create", data);
};

export const inventoryExport = async (data) => {
  return axiosAdmin.post("/inventory/export/create", data);
};

export const getListInventoryImport = async (data) => {
  const params = new URLSearchParams();
  if(data.limit) params.append("limit", data.limit)
  if(data.page) params.append("page", data.page)
  if(data.warehouse) params.append("warehouse", data.warehouse)
  if(data.import_price) params.append("import_price", data.import_price)
  if(data.sort) params.append("sort", data.sort)
  if(data.search) params.append("search", data.search)
  return axiosAdmin.get(`/inventory/import/get-list?${params.toString()}`);
};


export const getListInventoryExport = async (data = {}) => {
  const params = new URLSearchParams();

  if (data.limit) params.append("limit", data.limit);
  if (data.page) params.append("page", data.page);

  return axiosAdmin.get(`/inventory/export/get-list?${params.toString()}`);
};