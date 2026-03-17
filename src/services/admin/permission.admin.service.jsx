import axiosAdmin from "../../utils/axios.admin";


export const getPermissions = () => {
    return axiosAdmin.get("/permission");
}
export const changePermission = (data) => {
    return axiosAdmin.post("/permission/change", data);
}