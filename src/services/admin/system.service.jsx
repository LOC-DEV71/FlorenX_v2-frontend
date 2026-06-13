import axiosAdmin from "../../utils/axios.admin";

const getSystemConfig = () => {
  return axiosAdmin.get("/system");
};

const updateSystemConfig = (data, botAvatarFile) => {
  if (botAvatarFile) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("botAvatar", botAvatarFile);
    return axiosAdmin.patch("/system", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
  return axiosAdmin.patch("/system", data);
};

const testEmailConfig = (data) => {
  return axiosAdmin.post("/system/test-email", data);
};

const requestSecretOtp = () => {
  return axiosAdmin.post("/system/request-secret-otp");
};

const verifySecretOtp = (data) => {
  return axiosAdmin.post("/system/verify-secret-otp", data);
};

export { getSystemConfig, updateSystemConfig, testEmailConfig, requestSecretOtp, verifySecretOtp };
