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


export const logout = async () => {
  return axiosAdmin.post("/auth/logout");
}