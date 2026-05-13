import axiosClient from "../../utils/axios.client";

export const googleLogin = async (data) => {
  const response = await axiosClient.post(
    `/auth/login/google`,
    data,
    {
      withCredentials: true 
    }
  );
  return response.data;
};

export const getMe = () => {
  return axiosClient.get("/auth/get-me");
};


export const loginLocal = async (form) => {
  return axiosClient.post("/auth/login/local", form);
}

export const logout = async () => {
  return axiosClient.post("/auth/logout");
}

export const update = async (data) => {
  return axiosClient.post("/auth/update", data);
}

export const createUser = async (data) => {
  return axiosClient.post("/auth/create", data);
}

export const confirmOtp = async (data) => {
  return axiosClient.post("/auth/cofirm-otp", data);
}

export const forgotPassword = async (data) => {
  return axiosClient.post("/auth/forgot-password", data);
}

export const forgotPasswordOtp = async (data) => {
  return axiosClient.post("/auth/forgot-password-otp", data);
}

export const resetPassword = async (data) => {
  return axiosClient.post("/auth/reset-password", data)
}