import axiosAdmin from "../../utils/axios.client";

export const googleLogin = async (data) => {
  const response = await axiosAdmin.post(
    `/auth/login/google`,
    data,
    {
      withCredentials: true 
    }
  );
  return response.data;
};

export const getMe = () => {
  return axiosAdmin.get("/auth/get-me");
};


export const loginLocal = async (form) => {
  return axiosAdmin.post("/auth/login/local", form);
}

export const logout = async () => {
  return axiosAdmin.post("/auth/logout");
}

export const update = async (data) => {
  return axiosAdmin.post("/auth/update", data);
}

export const createUser = async (data) => {
  return axiosAdmin.post("/auth/create", data);
}

export const confirmOtp = async (data) => {
  return axiosAdmin.post("/auth/cofirm-otp", data);
}

export const forgotPassword = async (data) => {
  return axiosAdmin.post("/auth/forgot-password", data);
}

export const forgotPasswordOtp = async (data) => {
  return axiosAdmin.post("/auth/forgot-password-otp", data);
}

export const resetPassword = async (data) => {
  return axiosAdmin.post("/auth/reset-password", data)
}