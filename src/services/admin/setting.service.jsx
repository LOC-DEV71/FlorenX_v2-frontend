import axiosAdmin from "../../utils/axios.admin";
import axiosClient from "../../utils/axios.client";

const settingService = {
  getDetail: async () => {
    // Dùng API public để client không đăng nhập vẫn lấy được thông tin Web (Logo, Banner,...)
    const res = await axiosClient.get("/settings/detail");
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