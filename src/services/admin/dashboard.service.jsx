import axiosAdmin from "../../utils/axios.admin";

export const getDashboardOverview = (year) => {
    return axiosAdmin.get(`/dashboard/overview?year=${year}`);
};
