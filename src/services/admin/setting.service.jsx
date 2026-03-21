import axiosAdmin from "../../utils/axios.admin";

const settingService = {
  getDetail: async () => {
    const res = await axiosAdmin.get("/settings/detail");
    return res.data;
  },

  update: async (formData) => { 
    const res = await axiosAdmin.patch("/settings/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return res.data;
  }
};

export default settingService;