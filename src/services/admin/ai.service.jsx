import axiosAdmin from "../../utils/axios.admin";

export const askAdminAI = (message, chatHistory) => {
    return axiosAdmin.post("/ai/chat", { message, chatHistory });
};

export const getAdminChatHistory = () => {
    return axiosAdmin.get("/ai/history");
};
