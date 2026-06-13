import axiosAdmin from "../../utils/axios.admin";

export const askAdminAI = (message, chatHistory, files = []) => {
    if (files && files.length > 0) {
        const formData = new FormData();
        formData.append("message", message);
        formData.append("chatHistory", JSON.stringify(chatHistory));
        files.forEach((fileObj) => {
            if (fileObj.file) {
                formData.append("files", fileObj.file);
            }
        });
        return axiosAdmin.post("/ai/chat", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    }
    return axiosAdmin.post("/ai/chat", { message, chatHistory });
};

export const getAdminChatHistory = () => {
    return axiosAdmin.get("/ai/history");
};
