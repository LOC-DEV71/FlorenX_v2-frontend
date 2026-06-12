import { useState, useRef, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axiosClient from "../../../utils/axios.client";
import botAiImg from "../../../assets/banner/bot-ai.jpg";
import "./AIChatBox.scss";

function AIChatBox() {
    const [openChat, setOpenChat] = useState(false);
    const [chatMessage, setChatMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [showTooltip, setShowTooltip] = useState(false);
    const chatEndRef = useRef(null);

    // Lấy hoặc tạo sessionId
    const getSessionId = () => {
        let sid = localStorage.getItem("ai_session_id");
        if (!sid) {
            sid = "session_" + Math.random().toString(36).substring(2, 15);
            localStorage.setItem("ai_session_id", sid);
        }
        return sid;
    };

    // Quản lý hiển thị Tooltip chào mừng (Ẩn 5 phút nếu bị tắt)
    useEffect(() => {
        const closedAt = localStorage.getItem("ai_tooltip_closed_at");
        if (closedAt) {
            const timeDiff = Date.now() - parseInt(closedAt, 10);
            if (timeDiff < 5 * 60 * 1000) { // 5 phút
                setShowTooltip(false);
            } else {
                localStorage.removeItem("ai_tooltip_closed_at");
                setTimeout(() => setShowTooltip(true), 2000);
            }
        } else {
            setTimeout(() => setShowTooltip(true), 2000);
        }
    }, []);

    const handleCloseTooltip = (e) => {
        e.stopPropagation();
        setShowTooltip(false);
        localStorage.setItem("ai_tooltip_closed_at", Date.now().toString());
    };

    // Load lịch sử khi mở web
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const sid = getSessionId();
                const res = await axiosClient.get(`/ai/history/${sid}`);
                if (res.data?.code && res.data.data.length > 0) {
                    setMessages(res.data.data);
                } else {
                    setMessages([{ sender: "bot", text: "Xin chào! Mình là Veltrix-chan. Hôm nay cậu muốn mình tư vấn món đồ công nghệ nào nè? ✨" }]);
                }
            } catch (error) {
                console.error("Failed to load history", error);
            }
        };
        fetchHistory();
    }, []);

    // Tự động cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, openChat]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatMessage.trim()) return;

        const currentMessage = chatMessage;
        setChatMessage("");

        // Thêm tin nhắn user vào lịch sử và tin nhắn đang loading của bot
        setMessages(prev => [
            ...prev, 
            { sender: "user", text: currentMessage },
            { sender: "bot", text: "Veltrix-chan đang gõ...", isLoading: true }
        ]);

        try {
            const sid = getSessionId();
            const res = await axiosClient.post("/ai/chat", {
                message: currentMessage,
                sessionId: sid
            });

            if (res.data?.code) {
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { 
                        sender: "bot", 
                        text: res.data.response 
                    };
                    return newMessages;
                });
            } else {
                throw new Error("Lỗi API");
            }
        } catch (error) {
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { 
                    sender: "bot", 
                    text: "Veltrix-chan đang bị lag quá, cậu chờ xíu rồi hỏi lại nha! 🥺" 
                };
                return newMessages;
            });
        }
    };

    return (
        <div className={`ai-chat-wrapper ${openChat ? "active" : ""}`}>
            {openChat && (
                <div className="ai-chat-box">
                    <div className="ai-chat-header">
                        <div className="header-info">
                            <img src={botAiImg} alt="Veltrix AI" className="header-avatar" />
                            <span>Veltrix AI Assistant</span>
                        </div>
                        <CloseOutlined className="close-icon" onClick={() => setOpenChat(false)} />
                    </div>

                    <div className="ai-chat-content">
                        {messages.map((msg, index) => (
                            <div key={index} className={`ai-message ${msg.sender} ${msg.isLoading ? "loading" : ""}`}>
                                {msg.sender === "bot" && !msg.isLoading ? (
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            a: ({node, ...props}) => (
                                                <Link to={props.href} {...props} />
                                            )
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                ) : (
                                    msg.text
                                )}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <form className="ai-chat-footer" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Nhập câu hỏi cho AI..."
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                        />
                        <button type="submit" disabled={!chatMessage.trim()}>
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            )}

            {!openChat && showTooltip && (
                <div className="ai-tooltip" onClick={() => setOpenChat(true)}>
                    <img src={botAiImg} alt="Avatar" className="tooltip-avatar" />
                    <span>Cậu cần Veltrix-chan hỗ trợ gì không nè?</span>
                    <div className="tooltip-close" onClick={handleCloseTooltip}>
                        <CloseOutlined style={{ fontSize: '10px' }} />
                    </div>
                </div>
            )}

            <button className="ai-chat-toggle-btn" onClick={() => setOpenChat(!openChat)}>
                {openChat ? <CloseOutlined /> : <img src={botAiImg} alt="Veltrix AI" className="btn-avatar" />}
            </button>
        </div>
    );
}

export default AIChatBox;
