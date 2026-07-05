import axiosClient from "../../utils/axios.client";

const PREFIX = "/member-tiers";

export const getTiers = async () => {
  return await axiosClient.get(`${PREFIX}`);
};
